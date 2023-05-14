import React, { useState, useRef, useEffect } from "react";
import uniqueID from "../../../functionHelper/GenerateID";
import "./chatContent.css";
import Avatar from "../ChatList/Avatar";
import ChatItem from "./ChatItem";
function ChatContent({ messageData }) {
  const bottomRef = useRef(null);
  const [chatItems, setChatItems] = useState([]);

  const handleSetMessage = () => {
    console.log("mess data", messageData);
    if (messageData) {
      let lstMessage = messageData.map((item) => {
        if (item.from === "CUSTOMER") {
          return {
            key: uniqueID(),
            type: "me",
            msg: highlightEntity(item),
          };
        }
        if (item.from === "BOT") {
          return {
            key: uniqueID(),
            type: "other",
            msg: highlightEntity(item),
          };
        }
      });
      setChatItems(lstMessage);
    }
  };
  useEffect(() => {
    handleSetMessage();
  }, [messageData]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatItems]);

  const highlightEntity = (item) => {
    if (!item.hasOwnProperty("entities")) {
      return item.message;
    } else {
      let msg;
      item.entities.forEach((it) => {
        msg = item.message.replace(
          it.value,
          `<span id="highlight-entity">` + it.value + `</span>`
        );
      });
      return msg;
    }
  };
  return (
    <div className="main__chatcontent">
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <Avatar isOnline="active" />
            <p>Message history</p>
          </div>
        </div>
      </div>
      <div className="content__body" style={{ height: "70vh" }}>
        <div className="chat__items">
          {chatItems.map((itm, index) => {
            return (
              <ChatItem
                animationDelay={index + 2}
                key={itm.key}
                user={itm.type}
                msg={itm.msg}
                image={itm.image}
              />
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
export default ChatContent;
