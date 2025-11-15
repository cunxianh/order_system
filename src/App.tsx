// src/App.tsx
import { useState } from 'react'

import './App.css'

import { Routes, Route, Link } from "react-router-dom";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/auth_context';


import Register from "./components/register";
import Login from "./components/login";
import User_profile from "./components/profile";

function App() {

  return (
    <>
      <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<User_profile />} />
            </Routes>
          </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
