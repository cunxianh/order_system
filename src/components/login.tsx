// src/App.tsx
import { useState, useContext } from 'react'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'

import axios from 'axios';

import { Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_context';

function login() {
    // 定義驗證 schema
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

    const userSchema = Yup.object({
        username: Yup.string()
            .min(3, '最少 3 個字元')
            .max(20, '最多 20 個字元')
            .matches(/^[a-zA-Z0-9_]+$/, '只能包含字母、數字和底線')
            .required('必填'),
        password: Yup.string().min(6, '密碼至少 6 個字元').required()
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(userSchema)
    });

    interface UserFormData {
        username: string;
        password: string;
    }

    const onSubmit = (data: UserFormData) => {

        const api = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL
        });

        api.post('/users/login', { name: data.username, password: data.password }, { withCredentials: true })
            .then((res) => {

                alert('登入成功 🎉');
                navigate('/profile'); // 跳轉個人資料頁


            })
            .catch((err) => {
                console.error(err);
                alert('伺服器發生錯誤，請稍後再試。');

            });
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">

                {/* 標題區 */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        登入帳號
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        歡迎回來，請輸入您的資訊
                    </p>
                </div>

                {/* 表單區 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm space-y-4 m-6 p-1">

                        {/* 帳號輸入框 */}
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="使用者名稱"
                                className={`appearance-none relative block px-3 py-3 border ${errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm transition-colors`}
                                {...register('username')}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    ⚠️ {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* 密碼輸入框 */}
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="密碼"
                                className={`appearance-none relative block px-3 py-3 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm transition-colors`}
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    ⚠️ {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 按鈕區 */}
                    <div className="flex flex-col gap-4">
                        {/* 主要按鈕：登入 */}
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                        >
                            登入
                        </button>

                        {/* 分隔線 (選用，讓畫面更清楚) */}
                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">或是</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* 次要按鈕：註冊 */}
                        <Link to="/register" className="w-full">
                            <button
                                type="button"
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                註冊新帳號
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default login