import React, { useState } from "react";
import "../styles/main.css";
import "../styles/util.css";
import { POST } from "../functionHelper/APIFunction";
import { setCookie } from "../functionHelper/GetSetCookie";
import { Spin } from "antd";
const Login = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setSignUp] = useState(false);
  const [isFail, setFail] = useState(false);
  const handleLogin = () => {
    let apiURL = isSignUp ? "api/user/sign_up" : "api/user/login";
    try {
      let body = {
        fullname: fullName,
        username: username,
        password: rePassword,
      };
      POST(process.env.REACT_APP_BASE_URL + apiURL, JSON.stringify(body))
        .then((res) => {
          setLoading(false);
          if (res.http_status !== "OK") {
            setFail(true);
            throw res.exception_code;
          }
          setCookie("token", res.token, 3);
          setCookie("secret_key", res.secret_key, 3);
          setCookie("role", res.role, 3);

          setCookie("userId", res.user_id, 3);
          // navigate("/home");
          window.location.href = "/home";
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      handleLogin();
    }
  };
  const handleCheckPass = (val) => {
    setRePassword(val);
    if (isSignUp) {
      if (val === password) {
        setFail(false);
      } else {
        setFail(true);
      }
    }
  };
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <span className="login100-form-title p-b-26">
              Welcome to Chatbot service
            </span>
            <span className="login100-form-title p-b-48">
              <i className="zmdi zmdi-font"></i>
            </span>
            <div
              className="wrap-input100 validate-input"
              data-validate="Valid email is: a@b.c"
              hidden={isSignUp ? false : true}
            >
              <input
                className="input100"
                type="text"
                name="fullName"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>
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
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>

            <div
              className="wrap-input100 validate-input"
              hidden={isSignUp ? false : true}
              data-validate="Enter password"
            >
              <input
                className="input100"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>
            <div
              className="wrap-input100 validate-input"
              data-validate="Valid email is: a@b.c"
              style={{ marginBottom: "0px" }}
            >
              <input
                className="input100"
                type="password"
                name="re-enterpass"
                placeholder="Enter password"
                value={rePassword}
                onChange={(e) => {
                  handleCheckPass(e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>
            <p
              className="text-danger"
              id="login-fail-text"
              style={{
                marginBottom: "37px",
                visibility: isFail ? "visible" : "hidden",
              }}
            >
              Wrong user or password!!
            </p>

            <div className="wrap-login100-form-btn">
              <div className="login100-form-bgbtn"></div>
              <button
                className="login100-form-btn "
                onClick={() => {
                  setLoading(true);
                  handleLogin();
                }}
                style={{ background: "#00235b" }}
              >
                {loading ? (
                  <Spin
                    size="small"
                    style={{ width: "30px", height: "30px" }}
                  />
                ) : isSignUp ? (
                  "Register"
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="text-center p-t-115">
              <span className="txt1">
                {isSignUp ? "Already have account?" : "Don't have account"}
              </span>

              <p
                className="signUptxt"
                onClick={() => {
                  setSignUp(!isSignUp);
                }}
                style={{ cursor: "pointer" }}
              >
                {isSignUp ? "Login" : "Sign Up"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
