import React, { useState, useRef, useEffect, useCallback } from "react";
import uniqueID from "../../../functionHelper/GenerateID";
import "./chatContent.css";
import Avatar from "../ChatList/Avatar";
import ChatItem from "./ChatItem";
import { POST } from "../../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import { BASE_URL } from "../../../global/globalVar";

var secretKey = "A4FAB9F9-664B-446D-80B5-E9B089F3F500";
var scriptId = "638d685e61bc0357da5c1329";
var currentNodeId = "_BEGIN";

function ChatContent() {
  const bottomRef = useRef(null);
  const [chatItems, setChatItems] = useState([]);
  const [currentNode, setCurrentNode] = useState(currentNodeId);
  const [value, setValue] = useState("");

  const handleSendMessage = useCallback(() => {
    setChatItems((citems) => [
      ...citems,
      {
        key: uniqueID(),
        type: "me",
        msg: value,
      },
    ]);
    if (currentNodeId === "_END") return;
    let body = {
      secret_key: secretKey,
      script_id: scriptId,
      current_node_id: currentNode,
      message: value,
    };
    POST(BASE_URL + "api/training/predict", JSON.stringify(body))
      .then((res) => {
        if (res.http_status === "OK") {
          setCurrentNode(res.current_node_id);
          if (res.current_node_id !== "_END") {
            if (res.message != null && res.message.trim() != "") {
              setChatItems((citems) => [
                ...citems,
                {
                  key: uniqueID(),
                  type: "other",
                  msg: res.message,
                },
              ]);
            }
          }
        } else {
          throw res.exception_code;
        }
      })
      .catch((err) => {
        NotificationManager.error(err, "Error");
      });
  });
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatItems]);
  return (
    <div className="main__chatcontent">
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <Avatar isOnline="active" />
            <p>Try your chatbot</p>
          </div>
        </div>

        <div className="blocks">
          <div className="settings">
            <button className="btn-nobg">
              <i className="ri-settings-4-fill"></i>
            </button>
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
      <div className="content__footer">
        <div className="sendNewMessage">
          <button className="addFiles">
            <i className="ri-add-circle-fill"></i>
          </button>
          <input
            type="text"
            placeholder="Type a message here"
            id="msgText"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            value={value}
          />
          <button
            className="btnSendMsg"
            id="sendMsgBtn"
            onClick={() => {
              setValue("");
              handleSendMessage();
            }}
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatContent;
