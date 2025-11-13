// src/App.tsx
import { useState } from 'react'

import './App.css'

import { Routes, Route, Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";


import Register from "./components/Register";
import Login from "./components/Login";

function App() {

  return (
    <>
      <BrowserRouter>

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
