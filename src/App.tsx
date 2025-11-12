// src/App.tsx
import { useState } from 'react'

import './App.css'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'


function App() {
  // 定義驗證 schema
  const userSchema = Yup.object({
    username: Yup.string()
    .min(3, '最少 3 個字元')
    .max(20, '最多 20 個字元')
    .matches(/^[a-zA-Z0-9_]+$/, '只能包含字母、數字和底線')
    .required('必填'),
    password: Yup.string().min(8, '密碼至少 8 個字元').required()
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userSchema)
  });

  interface UserFormData {
  username: string;
  password: string;
}

  const onSubmit = (data : UserFormData) => {
    console.log(data);
  };




  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1>order system</h1>
          <input type="text" placeholder="username" {...register('username')}/>
          {errors.username && <p id='error'>{errors.username.message}</p>}
        </div>

        <div>
          <input type="password" placeholder='password' {...register('password')} />
          {errors.password && <p id='error'>{errors.password.message}</p>}
        </div>

        <button type="submit">登入</button>
      </form>
    </>
  )
}

export default App
