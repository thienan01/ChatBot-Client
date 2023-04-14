import { useState, useEffect } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import InputTitle from "../../components/Input/InputTitle";
import "../../styles/common.css";
function UpdateEntityModal({ open, toggle, entityType, func }) {
  const [name, setName] = useState("");
  const handleSetName = (value) => {
    setName(value);
  };
  useEffect(() => {
    setName(entityType.name);
  }, [entityType]);
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
                func(name, entityType.id);
              }}
            >
              Save
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

export default UpdateEntityModal;
