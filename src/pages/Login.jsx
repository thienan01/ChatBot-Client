import React, { useState } from "react";
import { BASE_URL } from "../global/globalVar";
import logo from "../assets/pngegg.png";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import "../styles/util.css";
import { POST } from "../functionHelper/APIFunction";
import { getCookie, setCookie } from "../functionHelper/GetSetCookie";
import Spinner from "react-bootstrap/Spinner";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    console.log("handle");
    try {
      let body = {
        username: username,
        password: password,
      };
      POST(BASE_URL + "api/user/login", JSON.stringify(body)).then((res) => {
        setLoading(false);
        if (res.http_status !== "OK") {
          throw res.exception_code;
        }
        setCookie("token", res.token, 3);
        navigate("/train");
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handletoRegister = () => {
    navigate("/register");
  };
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <img src={logo} alt="" id="logoLogin" />
            <span className="login100-form-title p-b-26">
              Welcome to Chatbot service
            </span>
            <span className="login100-form-title p-b-48">
              <i className="zmdi zmdi-font"></i>
            </span>

            <div
              className="wrap-input100 validate-input"
              data-validate="Valid email is: a@b.c"
            >
              <input
                className="input100"
                type="text"
                name="email"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>

            <div
              className="wrap-input100 validate-input"
              data-validate="Enter password"
            >
              <span className="btn-show-pass">
                <i className="zmdi zmdi-eye"></i>
              </span>
              <input
                className="input100"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div className="wrap-login100-form-btn">
              <div className="login100-form-bgbtn"></div>
              <button
                className="login100-form-btn bg-primary"
                onClick={() => {
                  setLoading(true);
                  handleLogin();
                }}
              >
                {loading ? (
                  <Spinner style={{ width: "30px", height: "30px" }} />
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="text-center p-t-115">
              <span className="txt1">Don’t have an account?</span>

              <a className="txt2" href="#">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
