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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h1>註冊頁面</h1>
                <input type="text" placeholder="username" {...register('username')} />
            </div>
            <div>
                <input type="password" placeholder="password" {...register('password')} />
            </div>
            <Link to="/">
                <button type="button">返回登入</button>
            </Link>
            <button type="submit">確定註冊</button>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </form>
    );
}

export default Register;