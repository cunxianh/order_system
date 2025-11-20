//components/register.tsx
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import axios from 'axios';

interface RegisterFormData {
    username: string;
    password: string;
}
const Register: React.FC = () => {
    const { register, handleSubmit } = useForm<RegisterFormData>();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = (data: RegisterFormData) => {
        setErrorMsg(''); // 清空前一次錯誤

        const api = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL
        });
        api.post('/users/register', { name: data.username, password: data.password })
            .then((res) => {
                if (res.status === 201 || res.data.success) {
                    console.log(res.data)
                    alert('註冊成功 🎉');
                    navigate('/'); // 跳轉登入頁
                } else {
                    setErrorMsg(res.data.message || '註冊失敗，請稍後再試。');
                }

            })
            .catch((err) => {
                console.error(err)
                if (err.response?.data?.message) {
                    setErrorMsg(err.response.data.message);
                } else {
                    setErrorMsg('伺服器發生錯誤，請稍後再試。');
                }
                console.error(err);
            });


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                
                {/* 標題區域 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        註冊新帳號
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        創建您的帳號以開始使用
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* 輸入框區域 */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input 
                                id="username"
                                type="text" 
                                placeholder="設定使用者名稱" 
                                className="appearance-none relative block px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                {...register('username')} 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input 
                                id="password"
                                type="password" 
                                placeholder="設定密碼" 
                                className="appearance-none relative block px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                {...register('password')} 
                            />
                        </div>
                    </div>

                    {/* 錯誤訊息顯示區 (如果有錯誤才顯示) */}
                    {errorMsg && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* 這裡可以放一個警告 icon */}
                                    <span className="text-red-400">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">
                                        {errorMsg}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 按鈕區域：使用 Flex column 讓按鈕上下排列 */}
                    <div className="flex flex-col gap-4 mt-6">
                        {/* 主要按鈕：註冊 */}
                        <button 
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
                        >
                            確定註冊
                        </button>

                        {/* 次要按鈕：返回登入 */}
                        <Link to="/" className="w-full">
                            <button 
                                type="button"
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                返回登入
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;