import React, { useRef, useState } from "react";
import { Container, Button, Tooltip } from "reactstrap";
import logo from "../../assets/logo.png";
import { NavLink, Link } from "react-router-dom";
import "../../styles/header.css";
import "../../styles/index.css";
import { Base } from "../../functionHelper/APIFunction";
import { getCookie, deleteAllCookies } from "../../functionHelper/GetSetCookie";
const nav__links = [
  {
    display: "HOME",
    path: "/home",
    icon: "fa-solid fa-house-chimney",
  },
  {
    display: "TRAINING",
    path: "/dashboard",
    icon: "fa-solid fa-cubes-stacked",
  },
  {
    display: "CONTACT",
    path: "/profile",
    icon: "fa-regular fa-address-card",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");
  const toggle = () => {
    setOpen(!isOpen);
  };
  const checkLogin = () => {
    const cookie = getCookie("token");
    return cookie ? true : false;
  };
  const logout = () => {
    deleteAllCookies();
    window.location.href = "/login";
  };
  return (
    <div className="header shadow bg-white nav__wrapper d-flex align-items-center justify-content-between">
      <div className="logo-nav logo" style={{ width: "500px" }}>
        <img src={logo} style={{ width: "150px" }} alt="logo" />
      </div>

      <div
        className="navigation menu d-flex align-items-center gap-5"
        ref={menuRef}
        style={{ width: "500px", justifyContent: "center" }}
      >
        {nav__links.map((item, index) => (
          <div key={index}>
            <NavLink
              onClick={toggleMenu}
              to={item.path}
              className={(navClass) =>
                navClass.isActive ? "active__menu" : ""
              }
            >
              <li className={item.icon} style={{ fontSize: "25px" }}></li>
              <br />
            </NavLink>
          </div>
        ))}
      </div>

      <div
        className="nav__right d-flex align-items-center gap-4"
        style={{ width: "500px", justifyContent: "end" }}
      >
        <span className="mobile__menu" onClick={toggleMenu}>
          <i className="ri-menu-line"></i>
        </span>
        <span className="user">
          <Link to="/document">
            <div className="documentation">
              <i className="fa-solid fa-print" style={{ fontSize: "15px" }}></i>{" "}
              DOCUMENTATION
            </div>
          </Link>
        </span>
        <Link to="/login">
          <Button
            color="danger"
            href="https://www.creative-tim.com/product/paper-kit-pro-react?ref=pkr-index-navbar"
            target="_blank"
            style={{ borderRadius: "30px" }}
            onClick={logout}
          >
            <i
              className="fa-solid fa-rocket"
              style={{
                marginLeft: "2px",
                marginRight: "2px",
                fontSize: "15px",
              }}
            ></i>{" "}
            {checkLogin() ? "Sign out" : "Login"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
