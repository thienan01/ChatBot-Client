import React from 'react'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import Routes from '../../routes/Routers'

const Layout = () => {
  return <div>
    {window.location.pathname !== "/login" && "/register"? <Header /> : null}{" "}
    {/* <Header/> */}
    <div>
        <Routes/>
    </div>
    <Footer/>
  </div>
}

export default Layout