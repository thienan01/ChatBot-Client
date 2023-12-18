import { useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import InputTitle from "../Input/InputTitle";
import { ReactComponent as Pending } from "../../assets/load.svg";
function PendingModal({ open, toggle, handleSave }) {
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalBody>
          <Pending />
          <h4 style={{ textAlign: "center" }}>
            Generating, Wait for a minutes...
          </h4>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default PendingModal;
