// src/App.tsx
import { useState } from 'react'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'

import axios from 'axios';

import { Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";




function login() {
  // 定義驗證 schema
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
    console.log(data);
    console.log(import.meta.env.VITE_BACKEND_URL);

    const api = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL
    });

    api.post('/users/login', { name: data.username, password: data.password })
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1>登入頁面</h1>
          <input type="text" placeholder="username" {...register('username')} />
          {errors.username && <p id='error'>{errors.username.message}</p>}
        </div>

        <div>
          <input type="password" placeholder='password' {...register('password')} />
          {errors.password && <p id='error'>{errors.password.message}</p>}
        </div>

        <button type="submit">登入</button>


          <Link to= "/register">
            <button type="button">註冊</button>
          </Link>

        
        

      </form>
    </>
  )
}

export default login