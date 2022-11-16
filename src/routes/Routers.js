import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Account from '../pages/Account'
import Chat from '../pages/Chat'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Training from '../pages/Training'

const Routers = () => {
  return <Routes>
            <Route path='/' element={<Navigate to='/login'/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/accountprofile' element={<Account/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/train' element={<Training/>}/>
            <Route path='/chat' element={<Chat/>}/>
        </Routes>
}

export default Routers