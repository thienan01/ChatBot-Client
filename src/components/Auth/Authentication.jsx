import React from "react";
import { getCookie } from "../../functionHelper/GetSetCookie";
import { useNavigate } from "react-router-dom";

function Authentication(props) {
  const { component: Component } = props;
  const navigate = useNavigate();

  const checkList = ["userId", "secret_key", "token", "role"];
  const checkLogin = () => {
    let listErr = [];
    checkList.forEach((item) => {
      if (getCookie(item) === "" || getCookie(item) === undefined) {
        listErr.push(item);
      }
    });
    return listErr.length > 0 ? false : true;
  };
  const redirect = () => {
    setTimeout(() => {
      navigate("/login");
    }, 10);
  };
  return checkLogin() ? <Component /> : redirect();
}
export default Authentication;
