import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FlowContainer from "../pages/Flow";
import Chat from "../pages/Chat"
import ListScript from "../pages/ListScript";
import ListIntent from "../pages/ListIntent";
import ListPattern from "../pages/ListPattern";
const Routers = () => {
  return (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/train" element={<FlowContainer />} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/listscript" element={<ListScript/>} />
          <Route path="/listintent" element={<ListIntent/>} />
          <Route path="/listpattern" element={<ListPattern/>} />
        </Routes>
  );
};

export default Routers;
