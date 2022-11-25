import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupText,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import { POST } from "../functionHelper/APIFunction";
import "../styles/login.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [toggle, setToggle] = useState({ name: "", isActive: false });

  useEffect(() => {
    console.log("state toggle >", toggle);
    console.log("username>", username);
    console.log("password>", password);
    console.log("confirmPassword >", confirmPassword);
    console.log("fullname >", fullname);
  }, [toggle, username, password, confirmPassword, fullname]);

  const handletoSignUp = () => {
    let body = {
      username: username,
      password: password,
      fullname: fullname,
    };
    POST(
      "https://chatbot-vapt.herokuapp.com/api/user/sign_up",
      JSON.stringify(body)
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login__section">
      <Container className="login__container">
        <Row>
          <Col lg="6" md="6" sm="12" className="m-auto text-center centered">
            {/* tomorow check form__container */}
            <h2>Create your own account!</h2>
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

                <h6 className="form__label">Full Name:</h6>
                <div className="form__group">
                  <InputGroup className="Input">
                    <InputGroupText>
                      <i className="ri-shield-user-line"></i>
                    </InputGroupText>
                    <Input
                      type="text"
                      name="fullname"
                      placeholder="Full Name"
                      required
                      onChange={(u) => setFullname(u.target.value)}
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
                      type={
                        toggle.name === "password" && toggle.isActive
                          ? "text"
                          : "password"
                      }
                      placeholder="Password"
                      name="password"
                      required
                      onChange={(p) => setPassword(p.target.value)}
                    />
                    <Button
                      onClick={() =>
                        setToggle({
                          name: "password",
                          isActive: !toggle.isActive,
                        })
                      }
                      color="primary"
                    >
                      {toggle.name === "password" && toggle.isActive ? (
                        <i className="ri-eye-close-line"></i>
                      ) : (
                        <i className="ri-eye-line"></i>
                      )}
                    </Button>
                  </InputGroup>
                </div>
                <h6 className="form__label">Confirm Password:</h6>
                <div className="form__group">
                  <InputGroup className="Input">
                    <InputGroupText>
                      <i className="ri-key-line"></i>
                    </InputGroupText>
                    <Input
                      type={
                        toggle.name === "confirm" && toggle.isActive
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm Password"
                      name="password"
                      required
                      onChange={(p) => {
                        p.target.value !== password
                          ? setAlert(true)
                          : setAlert(false);
                      }}
                    />
                    <Button
                      onClick={() =>
                        setToggle({
                          name: "confirm",
                          isActive: !toggle.isActive,
                        })
                      }
                      color="primary"
                    >
                      {toggle.name === "confirm" && toggle.isActive ? (
                        <i className="ri-eye-close-line"></i>
                      ) : (
                        <i className="ri-eye-line"></i>
                      )}
                    </Button>
                  </InputGroup>
                </div>
                <Alert
                  color="danger"
                  style={{ padding: "6px", display: alert ? "block" : "none" }}
                >
                  Confirm password incorrect!!!!
                </Alert>
                <Button
                  type="submit"
                  color="success"
                  outline
                  className="register__btn"
                  onClick={handletoSignUp}
                >
                  Register
                </Button>

                <Link to="/login">Already have an account?</Link>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
