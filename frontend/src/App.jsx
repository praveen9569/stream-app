import React from "react";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import Notification from "./pages/Notification.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import  { Toaster } from "react-hot-toast";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "./lib/axios.js"; // Importing the axios instance

import { useQuery } from "@tanstack/react-query";





const App = () => {
  // tackstack query
  const {data, isLoading ,error} = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
       return res.data;
    }
  });
  console.log(data);
 



  return (
    <div className=" h-screen " data-theme="aqua">
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </div>
  );
 };

export default App;
