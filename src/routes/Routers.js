import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Training from '../pages/Training'

const Routers = () => {
  return <Routes>
            <Route path='/' element={<Navigate to='/login'/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/train' element={<Training/>}/>
        </Routes>
}

export default Routers