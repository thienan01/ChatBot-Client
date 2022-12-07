import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import ChatContent from "../Chat/ChatContent/ChatContent";
function ModalChatTrial({ openChat, closeModal }) {
  return (
    <div>
      <Modal isOpen={openChat} style={{ maxWidth: "700px" }}>
        <ModalBody style={{ padding: "0px" }}>
          <ChatContent />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalChatTrial;
