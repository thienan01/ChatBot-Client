import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ScriptContext } from "../Context/ScriptContext";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
function ModalUpdateScript({ open, toggle }) {
  const navigate = useNavigate();
  const context = useContext(ScriptContext);
  const [name, setName] = useState("");
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalHeader>Create new script</ModalHeader>
        <ModalBody>
          <Label>Script name:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              context.setValue({ id: "", name: name });
              navigate("/train");
            }}
          >
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalUpdateScript;
