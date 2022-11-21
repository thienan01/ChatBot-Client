import React, {useState,useEffect} from 'react'

import { Container, Row, Col, InputGroup, InputGroupText, Input, Button} from "reactstrap"
import {useNavigate} from 'react-router-dom'
import "../styles/login.css"
import { postUser } from '../lib/apis/user';

const Login = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [res, setRes] = useState('');

  const submitHandler = e=>{
    e.preventDefault()
  }

  useEffect(() => {
    console.log(res);
  },[res]);

  const handleToggle = () => {
    setToggle(!toggle);
  }

  const handleLogin = async () => {
    console.log('username', username);
    console.log('password', password);
    try {
        const res = await postUser({username: username, password: password});
        // console.log('res >>>', res);
        setRes(res);
      } catch (e) {
        console.log(e);
      }
  }

  const handletoRegister = () => {
    navigate('/register');
  }

  {/* <CommonSection title='Login'/> */}
  return (
    <div className="login__section">
      <Container className="login__container">
        <Row>
          <Col lg="6" md="6" sm="12" className="m-auto text-center centered">
            {/* tomorow check form__container */}
            <h2>Welcome! Join our world now</h2>
          <form className="form mb-10" onSubmit={submitHandler}>
            <div className="form__container"> 
            <h6 className="form__label">Email:</h6>
            <div className="form__group">
              <InputGroup className="Input">
                <InputGroupText>
                  <i class="ri-mail-line"/>
                </InputGroupText>
                <Input type="email" name="email" placeholder="Email" required onChange={(u) => setUsername(u.target.value)}/>
              </InputGroup>
            </div>
            <h6 className="form__label">Password:</h6>
            <div className="form__group">
              <InputGroup className="Input">
                <InputGroupText>
                  <i class="ri-lock-line"></i>
                </InputGroupText>
                <Input type={toggle ? 'text' : 'password'} placeholder="Password" name="password" required onChange={(p) => setPassword(p.target.value)}/>
                <Button onClick={handleToggle} color="primary">
                    { !toggle ? (
                      <i class="ri-eye-close-line"></i>
                    ) : (
                      <i class="ri-eye-line"></i>
                    )}
                </Button>
              </InputGroup>
            </div>
             <InputGroup>
                    <Input type='checkbox' />
                    {' '}
                    <label style={{marginLeft: '5px'}}>Remember Me</label>
                    
              </InputGroup>
            <Container className="btn__container">
            <Button type="submit" color="success" outline className="add__btn" onClick={handletoRegister}>
              Register
            </Button>
            <Button type="submit" color="danger" outline className="add__btn" onClick={handleLogin}>
              Login
            </Button>
            </Container>
          </div>
          </form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login