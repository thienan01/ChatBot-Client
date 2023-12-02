import React from 'react'
import "./success.css"
import Helmet from '../../components/Helmet/Helmet'
const Success = () => {
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
               <p>Have a great day!</p>
               <p>[Chatbot-Service]</p>
               <a href="/home">Go to Home</a>
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