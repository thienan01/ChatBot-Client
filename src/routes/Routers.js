import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FlowContainer from "../pages/Flow";
import Chat from "../pages/Chat";
import Dashboard from "../components/Dashboard/Dashboard";
import Profile from "../components/CpnOfThien/Profile/Profile";
import Plan from "../components/CpnOfThien/ChoosePlan/Plan";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/train" element={<FlowContainer />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/plan" element={<Plan />} />
    </Routes>
  );
};

export default Routers;
