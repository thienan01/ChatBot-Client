import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import uniqueID from "../../../functionHelper/GenerateID";
import "./chatContent.css";
import Avatar from "../ChatList/Avatar";
import ChatItem from "./ChatItem";
import { POST } from "../../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import { BASE_URL } from "../../../global/globalVar";
import { getCookie } from "../../../functionHelper/GetSetCookie";
import { ScriptContext } from "../../Context/ScriptContext";
import typing from "../../../assets/Typing.gif";
function ChatContent({ sessionId }) {
  const context = useContext(ScriptContext);
  console.log("id chat", sessionId);
  const bottomRef = useRef(null);
  const [chatItems, setChatItems] = useState([]);
  const [currentNode, setCurrentNode] = useState("_BEGIN");
  const [value, setValue] = useState("");
  const [isShowTyping, setShowTyping] = useState(false);
  const handleSendMessage = useCallback(() => {
    setShowTyping(true);
    setChatItems((citems) => [
      ...citems,
      {
        key: uniqueID(),
        type: "me",
        msg: value,
      },
    ]);
    let body = {
      secret_key: getCookie("secret_key"),
      script_id: context.value.id,
      current_node_id: currentNode,
      message: value,
      session_id: sessionId,
      is_trying: true,
    };
    POST(BASE_URL + "api/training/predict", JSON.stringify(body))
      .then((res) => {
        if (res.http_status === "OK") {
          setCurrentNode(res.current_node_id);
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
        } else {
          NotificationManager.error(res.exception_code, "Error");
        }
        setShowTyping(false);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatItems]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setValue("");
      handleSendMessage();
    }
  };
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
        <img
          src={typing}
          alt=""
          className="typing"
          style={{ display: isShowTyping ? "block" : "none" }}
        />
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
            onKeyDown={(e) => handleKeyDown(e)}
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
