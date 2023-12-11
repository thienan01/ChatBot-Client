import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie } from '../../functionHelper/GetSetCookie';
import { GET } from "../../functionHelper/APIFunction"

import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Modal, Button } from 'antd';
const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {

  const [globalPackage, setGlobalPackage] = useState('Initial Value');
  const [globalUserID, setGlobalUserID] = useState('Initial Value')

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cookie = getCookie("token");
  const socket = new SockJS(process.env.REACT_APP_BASE_URL + 'api/ws_endpoint');
  const stompClient = Stomp.over(() => new SockJS(process.env.REACT_APP_BASE_URL + 'api/ws_endpoint'));
  const login = () => {
    if (`${cookie}` !== ``) {

      let apiURL = "api/user/get_profile";
      GET(
        process.env.REACT_APP_BASE_URL + apiURL
      ).then((res) => {
        setGlobalPackage(res.current_service_pack)
        setGlobalUserID(res.id)
        const topic = `/chat-listener/${res.id}`;

        const onConnect = () => {
          console.log('Connected to WebSocket');
          stompClient.subscribe(topic, (message) => {
            const receivedSessionId = JSON.parse(message.body).session_id;
            const scriptId = JSON.parse(message.body).script_id;
            const currentNodeId = JSON.parse(message.body).current_node_id;
            showModal(receivedSessionId, scriptId, currentNodeId);
          });
        };

        const onError = (error) => {
          console.error('Error during WebSocket connection:', error);

        };
        stompClient.connect({}, onConnect, onError);
      })

      setIsLoggedIn(true);
    }

  };
  const logout = () => {

    if (`${cookie}` === ``) {
      console.log("chua login")
      stompClient.disconnect();
      setIsLoggedIn(false);
    }
  };
  const isChatAppPage = window.location.pathname === '/receive-from-client';

  const showModal = (sessionId, scriptId, currentNodeId) => {
    if (!isChatAppPage) {
      Modal.confirm({
        title: 'Notification',
        content: `You have a message from Session: ${sessionId} needs to be replied.`,
        onOk: () => openChatTab(sessionId, scriptId, currentNodeId),
        okText: 'Reply now',
        zIndex: 1001
      });
    }
  };
  const openChatTab = (sessionId, scriptId, currentNodeId) => {
    const url = `/receive-from-client?sessionId=${sessionId}&scriptId=${scriptId}&currentNodeId=${currentNodeId}`;
   const storedData = JSON.parse(localStorage.getItem('chatData'));

  if (storedData) {
    const { sessionId: storedSessionId, scriptId: storedScriptId, currentNodeId: storedCurrentNodeId } = storedData;
    
    if (sessionId === storedSessionId && scriptId === storedScriptId && currentNodeId === storedCurrentNodeId) {
      console.log('Data matches existing tab. Focusing on existing tab.');
      window.focus(); 
      return;
    }
  }

  const dataToStore = { sessionId, scriptId, currentNodeId };
  localStorage.setItem('chatData', JSON.stringify(dataToStore));

  window.open(url, '_blank');
  };
  useEffect(() => logout(), []);
  useEffect(() => login(), []);
  return (
    <GlobalContext.Provider value={{ globalPackage, setGlobalPackage, globalUserID, setGlobalUserID, isLoggedIn, login, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

export { GlobalProvider, useGlobalContext };
