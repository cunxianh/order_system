// src/App.tsx

import './App.css'

import { Routes, Route } from "react-router-dom";

import { BrowserRouter } from "react-router-dom";

import Register from "./components/register";
import Login from "./components/login";
import User_profile from "./components/profile";
import CreateOrder from './components/order/create_order';
import AllOrder from './components/order/all_order';

import { LoadingProvider } from './context/LoadingContext';
import GlobalLoading from "./components/features/Loading";
import { CookieProvider} from './context/CookieCotext';
import CookieConsent from "./components/features/CookieConsent";

function App() {

  return (
    <>
      <BrowserRouter>
        <LoadingProvider>
          <CookieProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/profile" element={<User_profile />} />
              <Route path="/create_order" element={<CreateOrder />} />
              <Route path="/all_order" element={<AllOrder />} />
              
            </Routes>
            <CookieConsent />
            <GlobalLoading/>
          </CookieProvider>
        </LoadingProvider>
      </BrowserRouter>
    </>
  )
}

export default App
