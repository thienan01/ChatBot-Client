import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Chat from '../pages/Chat'
import Account from '../pages/Account'

const Routers = () => {
  return <Routes>
            <Route path='/' element={<Navigate to='/home'/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/profile' element={<Account/>}/>
        </Routes>
}

export default Routers