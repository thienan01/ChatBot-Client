import { useState, useEffect } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import InputTitle from "../../components/Input/InputTitle";
import "../../styles/common.css";
function AddEntityModal({ open, toggle }) {
  const [name, setName] = useState("");
  const handleSetName = (value) => {
    setName(value);
  };
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalBody>
          <InputTitle
            placeHolder={"Enter entity name"}
            title={"Entity name"}
            val={name}
            func={handleSetName}
          />
          <div className="d-flex justify-content-end">
            <Button
              className="btn-prim"
              onClick={() => {
                setName("");
                toggle(name);
              }}
            >
              Create
            </Button>
            <Button
              className="closeBtn"
              onClick={() => {
                setName("");
                toggle();
              }}
            >
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddEntityModal;
