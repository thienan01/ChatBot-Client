import React, {useRef, useState} from 'react'
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ messages}) => {

  

  return (
    <div>
      
      <MessageList messages={messages} />
      <div style={{ bottom:"0"}}>
         </div> 
    </div>
  );
};

export default ChatWindow;
