import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
function ModalUpdatePattern({ open, toggle, value, update }) {
  const [content, setContent] = useState("");
  useEffect(() => {
    setContent(value.content);
  }, [value.content]);

  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalHeader>Update intent</ModalHeader>
        <ModalBody>
          <Label>Content:</Label>
          <Input
            type="text"
            value={content || ""}
            onChange={(e) => setContent(e.target.value)}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              update(value.id, content);
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

export default ModalUpdatePattern;
