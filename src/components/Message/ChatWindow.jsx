import React, {useRef, useState} from 'react'
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div>
      
      <MessageList messages={messages} />
      <div style={{ bottom:"0"}}>
      {/* <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSendMessage={handleSendMessage}
      /> */}
         </div> 
    </div>
  );
};

export default ChatWindow;
