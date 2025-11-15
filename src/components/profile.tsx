//componebts/profile.tsx
import React from 'react';
import { AuthContext } from '../context/auth_context';
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL
    });

    const [name, setName] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

    useEffect(() => {
        api.get('/profile/me', {
            withCredentials: true,
        })
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
        api.post('/users/logout', {}, {
            withCredentials: true,
        })
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
        <div>
            <div className="profile-actions">

                <button onClick={logout}>登出</button>

                <div className="order-buttons">
                    <button>全局訂單</button>
                    <button>我的訂單</button>
                    <button>創建訂單</button>
                </div>

            </div>

            <h1>使用者個人資料頁面</h1>

            <p>姓名: {name}</p>
            <p>註冊時間: {createdAt}</p>
        </div>
    );
}

export default Profile;