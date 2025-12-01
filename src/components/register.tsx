//components/register.tsx
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { API } from '../api/backend_connect';


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

        const api = API;

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
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">

                {/* 標題區域 */}
                <div className="text-center">

                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        註冊新帳號
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        簡單幾步，立即開始管理您的訂單
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* 輸入框區域 */}
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                                設定使用者名稱
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="例如: user123"
                                className="block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                {...register('username')}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                設定密碼
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="至少 6 位數密碼"
                                className="block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                {...register('password')}
                            />
                        </div>
                    </div>

                    {/* 錯誤訊息顯示區 - 優化為 Alert 樣式 */}
                    {errorMsg && (
                        <div className="rounded-lg bg-red-50 p-4 border border-red-100 animate-fade-in">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-red-400">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">註冊失敗</h3>
                                    <div className="mt-1 text-sm text-red-700">
                                        <p>{errorMsg}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 按鈕區域 */}
                    <div className="space-y-4 pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                        >
                            確定註冊
                        </button>

                        <div className="text-center">
                            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                ← 返回登入
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;