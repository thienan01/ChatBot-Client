import React from "react";
import { Modal, ModalBody } from "reactstrap";
import ChatContent from "../Chat/ChatContent/ChatContent";
import uniqueID from "../../functionHelper/GenerateID";
function ModalChatTrial({ openChat, closeModal }) {
  console.log("re-render");
  return (
    <div>
      <Modal
        isOpen={openChat}
        style={{ width: "600px" }}
        className="modal-setting"
      >
        <ModalBody style={{ padding: "0px" }}>
          <ChatContent sessionId={uniqueID()} />
        </ModalBody>
        <div className="close-button" onClick={closeModal}>
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      </Modal>
    </div>
  );
}

export default ModalChatTrial;
