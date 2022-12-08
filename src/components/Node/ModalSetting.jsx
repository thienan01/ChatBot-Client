import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
function ModalSetting({
  open,
  closeModalSetting,
  message,
  messageEnd,
  setMsg,
}) {
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalHeader>Setting</ModalHeader>
        <ModalBody>
          <Label>Wrong message:</Label>
          <Input
            type="text"
            value={message || ""}
            onChange={(e) => {
              setMsg(e.target.value, messageEnd);
            }}
          ></Input>
          <Label>End conversation:</Label>
          <Input
            type="text"
            value={messageEnd || ""}
            onChange={(e) => {
              setMsg(message, e.target.value);
            }}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModalSetting}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalSetting;
