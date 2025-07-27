import React from "react";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import { Route, Routes,Navigate } from "react-router";
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
  const {data:authData, isLoading ,error} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
       return res.data;
    },
    retry: false,
  });
  const authUser = authData?.user;
 
  



  return (
    <div className=" h-screen " data-theme="aqua">
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser? <LoginPage /> : <Navigate to="/"/>} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login"/>} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login"/>} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login"/>} />
        <Route path="/notification" element={authUser ? <Notification /> : <Navigate to="/login"/>} />
      </Routes>
      <Toaster />
    </div>
  );
 };

export default App;
