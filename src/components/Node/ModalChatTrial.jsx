import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import ChatContent from "../Chat/ChatContent/ChatContent";
function ModalChatTrial({ openChat, closeModal }) {
  return (
    <div>
      <Modal
        isOpen={openChat}
        style={{ width: "600px" }}
        className="modal-setting"
      >
        <ModalBody style={{ padding: "0px" }}>
          <ChatContent />
        </ModalBody>
        <div className="close-button" onClick={closeModal}>
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      </Modal>
    </div>
  );
}

export default ModalChatTrial;
