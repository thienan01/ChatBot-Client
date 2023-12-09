import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import ChatWindow from './ChatWindow';
import { POST, Base } from '../../functionHelper/APIFunction';
//const socket = io('http://localhost:3001');

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);
  const socket = new SockJS(process.env.REACT_APP_BASE_URL + 'api/ws_endpoint');
  const stompClient = Stomp.over(socket)
  let sessionId = Base.getAllUrlParams().sessionId
  let scriptId = Base.getAllUrlParams().scriptId
  let currentNodeID = Base.getAllUrlParams().current_node_id

  const loadMessage = () => {
    let body = {
      page: 1,
      size: 100,
      session_id: sessionId,
      script_id: scriptId
      
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/message_history/",
      JSON.stringify(body)
    )
      .then(data => {
        const formattedMessages = data.items.map(items => ({
          text: items.message,
          user: items.from === 'BOT' ? 'Bot' : 'Customer',
        }));

        setMessages(formattedMessages);
        //console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });


  }
  useEffect(() => {
    loadMessage()

  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected to WebSockettt');
      const topic = `/chat/${sessionId}/receive-from-client`;
      stompClient.subscribe(topic, (message) => {
        //handleReceivedMessage(JSON.parse(message.body));

        const currentNodeIDNew = JSON.parse(message.body).current_node_id;
        // const messageReceived = JSON.parse(message.body).message;
        // const initialMessage = { text: "Xin chào!", user: 'Customer' };
        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   initialMessage
        // ]);
       // console.log(initialMessage)
        sendMessage(currentNodeIDNew)
      });
    };
    const onError = (error) => {
      console.error('Error during WebSocket connection:', error);

    };
    stompClient.connect({}, onConnect, onError);
  }, [sessionId]);



  const sendMessage = (message) => {

    let body =
    {
      message: message,
      current_node_id: currentNodeID,
      script_id: scriptId
    };

    POST(process.env.REACT_APP_BASE_URL + `api/training/answer-message/${sessionId}`, JSON.stringify(body))
      .then((res) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, user: 'Bot' },
        ]);
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  };

  const sendMessageSubmit = () => {
    if (newMessage.trim() !== '') {
      sendMessage(newMessage);
      setNewMessage('');
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessageSubmit();
    }
  };
  return (
    <div>
      <ChatWindow messages={messages} />
      <div className="sendNewMessage" style={{ margin: "0px 200px" }}>
        <button className="addFiles" >
          <i class="fa-solid fa-microphone"></i>
        </button>
        <input
          type="text"
          placeholder="Type a message here"
          id="msgText"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <button
          className="btnSendMsg"
          id="sendMsgBtn"
          onClick={sendMessageSubmit}
        >
          <i class="fa fa-paper-plane-o"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
