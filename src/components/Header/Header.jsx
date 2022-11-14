import React, {useRef} from 'react'
import { Container } from 'reactstrap'
import logo from '../../assets/logo.png'
import { NavLink, Link } from 'react-router-dom'
import '../../styles/header.css'
import '../../styles/index.css'

const nav__links = [
    {
        display: 'Home',
        path: '/home'
    },
    {
        display: 'Training',
        path: '/train'
    },
    {
        display: 'Contact',
        path: '/contact'
    },

]

const Header = () => {
    
    const menuRef = useRef(null)
    const toggleMenu = () => menuRef.current.classList.toggle('show__menu')
    return <header className='header'>
    <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between" style={{height:"50px"}}>
        <div className='logo'>
            <img src={logo}  className="w-50" alt="logo"/>
            {/* <h5>Chatbot Training</h5> */}
        </div>

        <div className="navigation" ref={menuRef}>
            <div className="menu d-flex align-items-center gap-5">
                {
                    nav__links.map((item,index)=>(
                        <NavLink 
                        onClick={toggleMenu}
                        to={item.path} 
                        key={index}
                        className={navClass => 
                            navClass.isActive ? 'active__menu' : ""}
                        >
                            {item.display}
                            </NavLink>
                    ))
                }
            </div>
        </div>

        <div className="nav__right d-flex align-items-center gap-4">
            <span className="user">
                <Link to='/login'><i className="ri-user-line"></i></Link>
            </span>

            <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
            </span>
            
        </div>

        </div>
    </Container>
  </header>
}

export default Header