import React from 'react'
import "./plan.css"
import { NavLink, useNavigate} from 'react-router-dom';
import ScriptTable from '../Show/ScriptTable';
import { POST } from '../../functionHelper/APIFunction';
import { BASE_URL } from '../../global/globalVar';
const Plan = () => {
  const navigate = useNavigate()
  const navigateToDashboard = () =>{
    window.location.reload();
  }

  const paymentData = () => {
    let apiURL = "api/payment/paypal/authorize_payment";
    
    POST(
      BASE_URL + apiURL, JSON.stringify()
    ).then((res) => {
      if (res.status.http_status === "OK")
          {
            console.log("success")
            setTimeout(()=>{
            }, 5000)
            window.location.href = res.payload.approval_link; 
          }
      if (res.status.http_status !== "OK")
          {
            setTimeout(()=>{
            }, 2000)
          }
    });
  }
  
  return (
    <div id="generic_price_table">
      <section >
        <div className="container">
          {/* BLOCK ROW START */}
          <div className="row">
            
          

            <div className="col-md-6">
              {/* PRICE CONTENT START */}
              <div className="generic_content clearfix">
                {/* HEAD PRICE DETAIL START */}
                <div className="generic_head_price clearfix">
                  {/* HEAD CONTENT START */}
                  <div className="generic_head_content clearfix">
                    {/* HEAD START */}
                    <div className="head_bg"></div>
                    <div className="head">
                      <span>Normal</span>

                    </div>
                    {/* //HEAD END */}
                  </div>
                  {/* //HEAD CONTENT END */}
                  {/* PRICE START */}
                  <div className="generic_price_tag clearfix">
                    <span className="price">
                      <span className="sign"></span>
                      <span className="currency">FREE</span>
                      <span className="cent"></span>

                    </span>
                  </div>
                  {/* //PRICE END */}
                </div>
                {/* //HEAD PRICE DETAIL END */}
                {/* FEATURE LIST START */}
                <div className="generic_feature_list" style={{textAlign:"left"}}>
                  <ul>
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Create a chatbot and train it with user-generated data</li>
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Maximum: 5 scripts</li>
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Import dataset from file excel</li>
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Integrate a chatbot into an existing website</li>
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Review the chatbot's conversation history with users</li>
                   
                  <li><span className='p-1' style={{color:"red"}}><i class="ri-close-circle-fill"></i></span>Free to view and download all datasets on the platform: Data Everywhere </li>
                    
                    <li><span className='p-1' style={{color:"red"}}><i class="ri-close-circle-fill"></i></span> Create a script with high detail and extensive coverage (support 24/7 by admin) </li>
                    <li><span className='p-1' style={{color:"red"}}><i class="ri-close-circle-fill"></i></span> Generate training data and train the chatbot based on the information on the user's website (support 24/7 by admin)</li>
                    
                    <li><span className='p-1' style={{color:"red"}}><i class="ri-close-circle-fill"></i></span><span>24/7</span> Support</li>
                  </ul>
                </div>
                {/* //FEATURE LIST END */}
                {/* BUTTON START */}
                <div className="generic_price_btn clearfix" onClick={navigateToDashboard}>
                  <a className="" href="#" 
                  >
                    USE Now
                  </a>
                </div>
                {/* //BUTTON END */}
              </div>
              {/* //PRICE CONTENT END */}
            </div>
            <div className="col-md-6">
              {/* PRICE CONTENT START */}
              <div className="generic_content clearfix">
                {/* HEAD PRICE DETAIL START */}
                <div className="generic_head_price clearfix">
                  {/* HEAD CONTENT START */}
                  <div className="generic_head_content clearfix">
                    {/* HEAD START */}
                    <div className="head_bg"></div>
                    <div className="head">
                      <span>Premium</span>
                    </div>
                    {/* //HEAD END */}
                  </div>
                  {/* //HEAD CONTENT END */}
                  {/* PRICE START */}
                  <div className="generic_price_tag clearfix">
                    <span className="price">
                      <span className="sign">$</span>
                      <span className="currency">299</span>
                      <span className="cent">.99</span>

                    </span>
                  </div>
                  {/* //PRICE END */}
                </div>
                {/* //HEAD PRICE DETAIL END */}
                {/* FEATURE LIST START */}
                <div className="generic_feature_list" style={{textAlign:"left"}}>
                  <ul>
                  <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Create a chatbot and train it with user-generated data</li>
                  <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> No limit scripts</li>
                  <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Import dataset from file excel</li>
                  <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Integrate a chatbot into an existing website</li>
                  
                  <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Review the chatbot's conversation history with users</li>
                  <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span>Free to view and download all datasets on the platform: Data Everywhere </li>
                    
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Create a script with high detail and extensive coverage (support 24/7 by admin) </li>
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span> Generate training data and train the chatbot based on the information on the user's website (support 24/7 by admin)</li>
                    <li><span className='p-1' style={{color:"green"}}><i class="ri-checkbox-circle-fill"></i></span><span>24/7</span> Support</li>
                  </ul>
                </div>
                {/* //FEATURE LIST END */}
                {/* BUTTON START */}
                <div className="generic_price_btn clearfix">
                  <a className="" href="#">
                    Buy Now
                  </a>
                </div>
                {/* //BUTTON END */}
              </div>
              {/* //PRICE CONTENT END */}
            </div>
          </div>
          {/* //BLOCK ROW END */}
        </div>
      </section>
      <footer className=''>
      </footer>
    </div>
  )
}

export default Plan