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
import { POST, VOICE } from "../../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import { getCookie } from "../../../functionHelper/GetSetCookie";
import { ScriptContext } from "../../Context/ScriptContext";
import typing from "../../../assets/Typing.gif";
import { Input } from "reactstrap";
function ChatContent({ sessionId }) {
  const context = useContext(ScriptContext);
  console.log("id chat", sessionId);
  const bottomRef = useRef(null);
  const [chatItems, setChatItems] = useState([]);
  const [currentNode, setCurrentNode] = useState("_BEGIN");
  const [value, setValue] = useState("");
  const [isShowTyping, setShowTyping] = useState(false);
  const [isSaveHistory, setSaveHistory] = useState(false);
  const [isSpeech, setSpeech] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const handleSendMessage = useCallback((text) => {
    setShowTyping(true);
    setChatItems((citems) => [
      ...citems,
      {
        key: uniqueID(),
        type: "me",
        msg: value,
      },
    ]);
    console.log("ass", currentNode);
    let body = {
      secret_key: getCookie("secret_key"),
      script_id: context.value.id,
      current_node_id: currentNode,
      message: value,
      session_id: sessionId,
      is_trying: !isSaveHistory,
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/training/predict",
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.http_status === "OK") {
          console.log("curr note", res.current_node_id);
          setCurrentNode(res.current_node_id);
          if (res.message !== null && res.message.trim() !== "") {
            var convertedString = res.message.replace(/\n/g, "<br>");
            setChatItems((citems) => [
              ...citems,
              {
                key: uniqueID(),
                type: "other",
                msg: convertedString,
              },
            ]);
          }
          if (isSpeech) {
            // startListening();
            textToSpeech(res.message);
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

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "vi-VN"; // Set language to Vietnamese\

  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript;
    setValue((value) => value + (value === "" ? "" : ". ") + text);
    stopListening();
  };

  const startListening = () => {
    if (isRecording) {
      stopListening();
    } else {
      setRecording(true);
      recognition.start();
    }
  };
  const stopListening = () => {
    setRecording(false);
    recognition.stop();
  };

  const textToSpeech = (text) => {
    const apiUrl = "https://api.fpt.ai/hmi/tts/v5";

    VOICE(apiUrl, text)
      .then((res) => {
        // const audioURL = URL.createObjectURL(audioBlob);
        setTimeout(function () {
          //your code to be executed after 1 second
          // const audio = new Audio(res.async);
          // audio.play();
          const audio = new Audio(res.async);
          audio
            .play()
            .then()
            .catch((e) => {
              console.log("Error when play audio");
            });
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="main__chatcontent">
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <Avatar isOnline="active" />
            <p>Try your chatbot</p>
            {console.log("re-renderchat", currentNode)}
          </div>
        </div>

        <div className="blocks">
          <div className="d-flex align-items-center">
            <div className="settings">
              <button className="btn-nobg">
                <i className="ri-settings-4-fill"></i>
              </button>
            </div>
            <div className="settings" style={{ marginRight: "10px" }}>
              <span>Save history: </span>
              <Input
                type="checkbox"
                defaultChecked={isSaveHistory}
                onChange={(e) => {
                  setSaveHistory(e.target.checked);
                }}
              />
            </div>
            <div className="settings">
              <span>Speech: </span>
              <Input
                type="checkbox"
                defaultChecked={isSaveHistory}
                onChange={(e) => {
                  setSpeech(e.target.checked);
                }}
              />
            </div>
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
      <div
        className="recognition"
        style={{ display: isRecording ? "flex" : "none" }}
      >
        <button class="Rec btn-rec">Recording</button>
      </div>
      <div className="content__footer">
        <img
          src={typing}
          alt=""
          className="typing"
          style={{ display: isShowTyping ? "block" : "none" }}
        />
        <div className="sendNewMessage">
          <button className="addFiles" onClick={startListening}>
            <i class="fa-solid fa-microphone"></i>
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
