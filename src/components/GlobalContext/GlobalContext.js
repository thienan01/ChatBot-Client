import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "../../functionHelper/GetSetCookie";
import { GET } from "../../functionHelper/APIFunction";

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Modal, Button } from "antd";
const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [globalPackage, setGlobalPackage] = useState("Initial Value");
  const [globalUserID, setGlobalUserID] = useState("Initial Value");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cookie = getCookie("token");
  const socket = new SockJS(process.env.REACT_APP_BASE_URL + "api/ws_endpoint");
  const stompClient = Stomp.over(
    () => new SockJS(process.env.REACT_APP_BASE_URL + "api/ws_endpoint")
  );
  const login = () => {
    if (`${cookie}` !== ``) {
      let apiURL = "api/user/get_profile";
      GET(process.env.REACT_APP_BASE_URL + apiURL).then((res) => {
        setGlobalPackage(res.current_service_pack);
        setGlobalUserID(res.id);
        const topic = `/chat-listener/${res.id}`;

        const onConnect = () => {
          console.log("Connected to WebSocket");
          stompClient.subscribe(topic, (message) => {
            const receivedSessionId = JSON.parse(message.body).session_id;
            const scriptId = JSON.parse(message.body).script_id;
            const currentNodeId = JSON.parse(message.body).current_node_id;
            checkTabIsOpened(receivedSessionId, scriptId, currentNodeId);
          });
        };

        const onError = (error) => {
          console.error("Error during WebSocket connection:", error);
        };
        stompClient.connect({}, onConnect, onError);
      });

      setIsLoggedIn(true);
    }
  };
  setInterval(() => {
    checkTabIsOpened("sds", "Sds", "currentNodeId");
    console.log("new message");
  }, 5000);
  const logout = () => {
    if (`${cookie}` === ``) {
      console.log("chua login");
      stompClient.disconnect();
      setIsLoggedIn(false);
    }
  };
  const isChatAppPage = window.location.pathname === "/receive-from-client";

  const showModal = (url, lstTabs) => {
    if (!isChatAppPage) {
      Modal.confirm({
        title: "Notification",
        content: `You have a message needs to be replied.`,
        onOk: () => {
          window.open(url, "_blank");
          localStorage.setItem("chatTabs", JSON.stringify(lstTabs));
        },
        okText: "Reply now",
        zIndex: 1001,
      });
    }
  };
  const checkTabIsOpened = (sessionId, scriptId, currentNodeId) => {
    const url = `/receive-from-client?sessionId=${sessionId}&scriptId=${scriptId}&currentNodeId=${currentNodeId}`;
    let lstTabs = localStorage.getItem("chatTabs")
      ? JSON.parse(localStorage.getItem("chatTabs"))
      : [];
    let isOpened = false;
    if (lstTabs.length > 0) {
      lstTabs.forEach((tab) => {
        if (tab.url === url) {
          isOpened = true;
        }
      });
    }
    if (!isOpened) {
      lstTabs.push({
        url: url,
      });
      showModal(url, lstTabs);
    }
  };
  useEffect(() => logout(), []);
  useEffect(() => login(), []);
  return (
    <GlobalContext.Provider
      value={{
        globalPackage,
        setGlobalPackage,
        globalUserID,
        setGlobalUserID,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export { GlobalProvider, useGlobalContext };
