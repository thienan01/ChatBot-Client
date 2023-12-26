import React from 'react'
import "./success.css"
import Helmet from '../../components/Helmet/Helmet'
import { deleteAllCookies } from '../../functionHelper/GetSetCookie'
const Success = () => {
   const logout = () => {
      deleteAllCookies();
      window.location.href = "/login";
    };
  return (
    <>
    <Helmet title='Success'>
 <div class="container">
   <div class="row">
      <div class="col-md-6 mx-auto mt-5">
         <div class="payment">
            <div class="payment_header">
               <div class="check"><i class="ri-checkbox-circle-fill"></i></div>
            </div>
            <div class="content1">
               <h1>Payment Success !</h1>
               <p>I just wanted to drop you a quick note and let you know that I received your payment. Thank you so much. I really appreciate it.</p>
               <p>Please log in again to access Premium services!</p>
               <p>[Chatbot-Service]</p>
               <span onClick={logout}>Login Again</span>
            </div>
            
         </div>
      </div>
   </div>
</div>
</Helmet>
    </>
  )
}

export default Success