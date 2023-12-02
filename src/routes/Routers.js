import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FlowContainer from "../pages/Flow";
import Chat from "../pages/Chat";
import Dashboard from "../components/Dashboard/Dashboard";
import Profile from "../components/Profile/Profile";
import Success from "../components/ChoosePlan/Success";
import ConfirmPayment from "../components/ChoosePlan/ConfirmPayment";
import CancelPayment from "../components/ChoosePlan/CancelPayment";
import Plan from "../components/ChoosePlan/Plan";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/payment/paypal/success" element={<Success />} />
      <Route path="/script-detail">
        <Route index element={<Home />} />
        <Route path=":id" element={<FlowContainer />} />
      </Route>
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/payment/paypal/review_payment"
        element={<ConfirmPayment />}
      />
      <Route
        path="/payment/paypal/cancel_payment"
        element={<CancelPayment />}
      />
    </Routes>
  );
};

export default Routers;
