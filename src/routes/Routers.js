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
import ChatApp from "../components/Message/Chat";
import Authentication from "../components/Auth/Authentication";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Authentication component={Home} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route exact path="/home" element={<Authentication component={Home} />} />
      <Route path="/chat" element={<Authentication component={Chat} />} />
      <Route
        path="/dashboard"
        element={<Authentication component={Dashboard} />}
      >
        <Route index element={<Home />} />
        <Route path="" element={<Dashboard />} />
        <Route path="user-control">
          <Route path=":userId" element={<Dashboard />} />
        </Route>
      </Route>
      <Route path="/payment/paypal/success" element={<Success />} />
      <Route path="/script-detail">
        <Route index element={<Home />} />
        <Route
          path=":id"
          element={<Authentication component={FlowContainer} />}
        />
      </Route>
      <Route path="/profile" element={<Authentication component={Profile} />} />
      <Route
        path="/payment/paypal/review_payment"
        element={<ConfirmPayment />}
      />
      <Route
        path="/payment/paypal/cancel_payment"
        element={<CancelPayment />}
      />
      <Route path="/receive-from-client" element={<ChatApp/>}/>
    </Routes>
  );
};

export default Routers;
