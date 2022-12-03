import React, { Component } from "react";
import ChatContent from "../components/Chat/ChatContent/ChatContent";
import {Col} from "reactstrap"
import "../components/Chat/ChatList/chatList.css"

import "../styles/chat.css";


export default class ChatBody extends Component {
  render() {
    return (
      <div className="main__chatbody"  style={{ textAlign: "left", width: "100%", height: "70vh" }}>
        <Col lg="6" md="6" sm="12" className="m-auto text-left">
        </Col>
        <Col lg="6" md="6" sm="12" className="m-auto text-left">
        <ChatContent/>
        </Col>
      </div>
    );
  }
}