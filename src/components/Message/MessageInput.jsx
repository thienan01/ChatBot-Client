import React from 'react';
const MessageInput = ({ value, onChange, onSendMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSendMessage();
    }
  };
  return (
    <div >
      <div className="sendNewMessage" style={{ margin:"0px 200px"}}>
          <button className="addFiles" >
            <i class="fa-solid fa-microphone"></i>
          </button>
          <input
            type="text"
            placeholder="Type a message here"
            id="msgText"
            value={value} onChange={onChange} 
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <button
            className="btnSendMsg"
            id="sendMsgBtn"
            onClick= {onSendMessage}
          >
          <i class="fa fa-paper-plane-o"></i>
          </button>
        </div>
    </div>
  );
};

export default MessageInput;
