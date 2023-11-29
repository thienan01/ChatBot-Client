import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ScriptContext } from "../Context/ScriptContext";
import { Button, Modal, ModalBody } from "reactstrap";
import InputTitle from "../../components/Input/InputTitle";
import "../../styles/common.css";
function ModalUpdateScript({ open, toggle }) {
  const navigate = useNavigate();
  const context = useContext(ScriptContext);
  const [name, setName] = useState("");
  const handleSetName = (value) => {
    setName(value);
  };
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalBody>
          {/* <Label>Script name:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></Input> */}
          <InputTitle
            placeHolder={"Enter script name"}
            title={"Script name"}
            val={name}
            func={handleSetName}
          />
          <div className="d-flex justify-content-end">
            <Button
              className="btn-prim"
              onClick={() => {
                context.setValue({ id: "", name: name });
                navigate("/script-detail/new");
              }}
            >
              Create
            </Button>
            <Button className="closeBtn" onClick={toggle}>
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalUpdateScript;
