import { useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import InputTitle from "../Input/InputTitle";

function GenPatternGTPModal({ open, toggle, handleSave }) {
  const [numberOfPattern, setNumberOfPattern] = useState("");
  const [examplePattern, setExamplePattern] = useState("");

  const handleSetNumberPattern = (val) => {
    setNumberOfPattern(val);
  };
  const handleSetExamplePattern = (val) => {
    setExamplePattern(val);
  };

  const handleGenerate = () => {
    setNumberOfPattern("");
    setExamplePattern("");
    var data = {
      numOfPattern: numberOfPattern,
      examplePattern: examplePattern,
    };
    handleSave(data);
  };
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalBody>
          <span className="title">Generate pattern by GPT</span>
          <InputTitle
            title={"Number of pattern"}
            placeHolder={"Enter the number of pattern..."}
            val={numberOfPattern}
            func={handleSetNumberPattern}
          />
          <InputTitle
            title={"Example pattern"}
            placeHolder={"Enter an example of pattern..."}
            val={examplePattern}
            func={handleSetExamplePattern}
          />

          <div className="d-flex justify-content-end">
            <Button className="btn-prim" onClick={handleGenerate}>
              Generate
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

export default GenPatternGTPModal;
