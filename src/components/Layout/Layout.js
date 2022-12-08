import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Routes from "../../routes/Routers";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();
  return (
    <div>
      {pathname !== "/login" && pathname !== "/register" && <Header />}
      {/* <Header/> */}
      <div>
        <Routes />
      </div>
      {/* {pathname !== "/login" && pathname !== "/register1" && <Footer />} */}
    </div>
  );
};

export default Layout;
