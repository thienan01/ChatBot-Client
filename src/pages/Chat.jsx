import React, { Component } from "react";
import ChatContent from "../components/Chat/ChatContent/ChatContent";
import { Col } from "reactstrap";
import "../components/Chat/ChatList/chatList.css";
import "../styles/chat.css";

export default class ChatBody extends Component {
  render() {
    return <ChatContent />;
  }
}
