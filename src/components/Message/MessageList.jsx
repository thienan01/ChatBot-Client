import React, { useEffect, useRef } from "react";
import "./messagelist.css";
import Avt from "../../assets/pngegg.png";
import AvtClient from "../../assets/customers-icon-35906.png";
const MessageList = ({ messages }) => {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div>
      <ul className="message-list">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`messageRecei ${
              message.user === "Bot" ? "user-message" : "client-message"
            }`}
          >
            <div className="message-content">
              <strong>
                {message.user === "Customer" && (
                  <img className="avatar" src={AvtClient} alt="Your Avatar" />
                )}
              </strong>
              {message.text}
              {message.user === "Bot" && (
                <img className="avatar1" src={Avt} alt="Your Avatar" />
              )}
            </div>
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
};

export default MessageList;
