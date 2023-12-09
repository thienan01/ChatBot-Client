import React, { useState } from 'react'
import "./plan.css"
import { POST } from '../../functionHelper/APIFunction';
import { BASE_URL } from '../../global/globalVar';
import { useGlobalContext } from '../GlobalContext/GlobalContext';
import { Spin } from 'antd';
import {
  CheckOutlined,
  CloseOutlined
} from "@ant-design/icons";
const Plan = () => {
  const { globalPackage, setGlobalPackage } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false)
  const navigateToDashboard = () => {
    window.location.reload();
  }
  const paymentData = () => {
    let apiURL = "api/payment/paypal/authorize_payment";

    POST(
      process.env.REACT_APP_BASE_URL + apiURL, JSON.stringify()
    ).then((res) => {
      if (res.http_status === "OK") {
        setLoading(false);

        // setTimeout(()=>{
        // }, 5000)
        window.location.href = res.approval_link;
      }

    }
    )
      .catch((e) => {
        console.log(e);
      })
  }
  const paymentPremium = () => {
    setLoading(true);
    paymentData()
  }
  const paymentPremium1 = () => {
    setLoading(true);

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
                      <span>Normal </span>
                      {`${globalPackage}` === "NORMAL" && (

                        <span style={{ fontSize: "15px" }}>(current package)</span>

                      )}
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
                <div className="generic_feature_list" style={{ textAlign: "left" }}>
                  <ul>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Create a chatbot and train it with user-generated data</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Maximum: 5 scripts</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Import dataset from file excel</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Integrate a chatbot into an existing website</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Review the chatbot's conversation history with users</li>

                    <li><span className='p-2' ><CloseOutlined style={{ display: "inline-flex", color: "red" }} /></span>Free to view and download all datasets on the platform: Data Everywhere </li>
                    <li><span className='p-2' ><CloseOutlined style={{ display: "inline-flex", color: "red" }} /></span> Create a script with high detail and extensive coverage (support 24/7 by admin) </li>
                    <li><span className='p-2' ><CloseOutlined style={{ display: "inline-flex", color: "red" }} /></span> Generate training data and train the chatbot based on the information on the user's website (support 24/7 by admin)</li>

                    <li><span className='p-2' ><CloseOutlined style={{ display: "inline-flex", color: "red" }} /></span><span>24/7</span> Support</li>
                  </ul>
                </div>
                {/* //FEATURE LIST END */}
                {/* BUTTON START */}
                {`${globalPackage}` === "NORMAL" ? (
                  <div className="generic_price_btn clearfix p-b-37"
                    onClick={navigateToDashboard}
                  >
                    
                  </div>
                ) : (
                  <div className="generic_price_btn clearfix p-b-37"
                    
                  >
                    
                  </div>
                )}
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
                      {`${globalPackage}` === "PREMIUM" && (

                        <span style={{ fontSize: "15px" }}>(current package)</span>

                      )}

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
                <div className="generic_feature_list" style={{ textAlign: "left" }}>
                  <ul>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Create a chatbot and train it with user-generated data</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> No limit scripts</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Import dataset from file excel</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Integrate a chatbot into an existing website</li>

                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Review the chatbot's conversation history with users</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span>Free to view and download all datasets on the platform: Data Everywhere </li>

                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Create a script with high detail and extensive coverage (support 24/7 by admin) </li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span> Generate training data and train the chatbot based on the information on the user's website (support 24/7 by admin)</li>
                    <li><span className='p-2' ><CheckOutlined style={{ display: "inline-flex", color: "green" }} /></span><span>24/7</span> Support</li>
                  </ul>
                </div>
                {/* //FEATURE LIST END */}
                {/* BUTTON START */}

                {`${globalPackage}` === "PREMIUM" ? (
                  <div className="generic_price_btn clearfix p-b-37"
                    onClick={navigateToDashboard}
                  >
                    
                  </div>
                ) : (
                  <div className="generic_price_btn clearfix"
                    onClick={paymentPremium}
                  >
                    <a className="" href="#">
                      {loading ? (
                  <Spin
                    size="small"
                    style={{ width: "40px" }}
                  />
                ) : (
                  "BUY NOW"
                )}
                    </a>
                  </div>
                )}
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