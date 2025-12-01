//componebts/profile.tsx
import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import {API} from '../api/backend_connect';


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const api = API;

    const [name, setName] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    useEffect(() => {
        api.get('/profile/me')
            .then((res) => {
                console.log('已登入', res.data);
                setName(res.data.user.name);
                setCreatedAt(res.data.user.createdAt);

            })
            .catch((err) => {
                console.error(err);
                alert('請先登入');
                navigate('/');
            });
    }, []);


    function logout(): void {
        api.post('/users/logout')
            .then((res) => {
                console.log(res.data);
                alert('已登出');
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                alert('登出失敗，請稍後再試。');
            });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                
                {/* --- 1. 頭部區域：標題與登出 --- */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">個人中心</h1>
                    <button 
                        onClick={logout}
                        className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                        登出
                    </button>
                </div>

                {/* --- 2. 資訊展示區 --- */}
                <div className="flex flex-col items-center text-center mb-8">
                    {/* 模擬頭像 */}
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 font-bold text-3xl">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>註冊於：{createdAt}</span>
                    </div>
                </div>

                {/* --- 3. 功能操作區 (Grid 佈局) --- */}
                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={() => navigate('/create_order')}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        + 創建新訂單
                    </button>

                    <div className="grid grid-cols-1 gap-4">
 
                        <button 
                            onClick={() => navigate('/all_order')}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                        >
                            所有訂單
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;