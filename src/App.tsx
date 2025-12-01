// src/App.tsx

import './App.css'

import { Routes, Route } from "react-router-dom";

import { BrowserRouter } from "react-router-dom";
import { LoadingProvider } from './context/LoadingContext';
import GlobalLoading from "./components/loading/Loading";

import Register from "./components/register";
import Login from "./components/login";
import User_profile from "./components/profile";
import CreateOrder from './components/order/create_order';
import AllOrder from './components/order/all_order';

function App() {

  return (
    <>
      <BrowserRouter>
        <LoadingProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/profile" element={<User_profile />} />
            <Route path="/create_order" element={<CreateOrder />} />
            <Route path="/all_order" element={<AllOrder />} />
            
          </Routes>
          <GlobalLoading/>
        </LoadingProvider>
      </BrowserRouter>
    </>
  )
}

export default App
