import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Routes from "../../routes/Routers";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <div>
      {pathname !== "/login" && pathname !== "/register" && <Header />}
      {/* <Header/> */}
      <div>
        <Routes />
      </div>
      {pathname !== "/login" && pathname !== "/register1"}
    </div>
  );
};

export default Layout;
