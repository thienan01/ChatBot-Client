import React, { useState } from "react";
import { BASE_URL_LOCAL } from "../global/globalVar";
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupText,
  Input,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { POST } from "../functionHelper/APIFunction";
import { getCookie, setCookie } from "../functionHelper/GetSetCookie";

const Login = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleLogin = () => {
    try {
      let body = {
        username: username,
        password: password,
      };
      POST(BASE_URL_LOCAL + "/api/user/login", JSON.stringify(body)).then((res) => {
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
    <div className="login__section shadow">
      <Container className="login__container">
        <Row>
          <Col lg="6" md="6" sm="12" className="m-auto text-center centered">
            {/* tomorow check form__container */}
            <h2>Welcome! Join our world now</h2>
            <form className="form mb-10" onSubmit={submitHandler}>
              <div className="form__container">
                <h6 className="form__label">Username:</h6>
                <div className="form__group">
                  <InputGroup className="Input">
                    <InputGroupText>
                      <i className="ri-mail-line" />
                    </InputGroupText>
                    <Input
                      name="email"
                      placeholder="Username"
                      required
                      onChange={(u) => setUsername(u.target.value)}
                    />
                  </InputGroup>
                </div>
                <h6 className="form__label">Password:</h6>
                <div className="form__group">
                  <InputGroup className="Input">
                    <InputGroupText>
                      <i className="ri-lock-line"></i>
                    </InputGroupText>
                    <Input
                      type={toggle ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      required
                      onChange={(p) => setPassword(p.target.value)}
                    />
                    <Button onClick={handleToggle} color="primary">
                      {!toggle ? (
                        <i className="ri-eye-close-line"></i>
                      ) : (
                        <i className="ri-eye-line"></i>
                      )}
                    </Button>
                  </InputGroup>
                </div>
                <InputGroup>
                  <Input type="checkbox" />{" "}
                  <label style={{ marginLeft: "5px" }}>Remember Me</label>
                </InputGroup>
                <Container className="btn__container">
                  <Button
                    type="submit"
                    color="success"
                    outline
                    className="add__btn"
                    onClick={handletoRegister}
                  >
                    Register
                  </Button>
                  <Button
                    type="submit"
                    color="danger"
                    outline
                    className="add__btn"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </Container>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
