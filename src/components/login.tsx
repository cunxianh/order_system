// src/App.tsx

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'

import { Link } from "react-router-dom";

import { useNavigate } from 'react-router-dom';
import {API} from '../api/backend_connect';

function login() {
    // 定義驗證 schema
    const navigate = useNavigate();
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
        const api = API;

        api.post('/users/login', { name: data.username, password: data.password }, { withCredentials: true })
            .then(() => {
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
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                
                {/* 標題區 */}
                <div className="text-center">

                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        登入夜面
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        請輸入您的帳號密碼以登入系統
                    </p>
                </div>

                {/* 表單區 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                        {/* 帳號輸入框 */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                                使用者名稱
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="請輸入帳號"
                                className={`block w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm
                                    ${errors.username 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                                {...register('username')}
                            />
                            {errors.username && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    ⚠️ {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* 密碼輸入框 */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    密碼
                                </label>
                                {/* 如果未來有忘記密碼功能可放這 */}
                                {/* <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">忘記密碼？</a> */}
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className={`block w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm
                                    ${errors.password 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    ⚠️ {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 按鈕區 */}
                    <div className="space-y-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                        >
                            登入
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">還沒有帳號？</span>
                            </div>
                        </div>

                        <Link to="/register" className="w-full block">
                            <button
                                type="button"
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200"
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