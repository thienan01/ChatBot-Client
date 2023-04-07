import React from "react";
import { Modal, ModalBody } from "reactstrap";
import "../../pages/css/Flow.css";
import InputTitleTextArea from "../Input/InputTitleTextArea";
import InputTitle from "../Input/InputTitle";
function ModalSetting({
  open,
  closeModalSetting,
  message,
  messageEnd,
  setMsg,
  scriptName,
  handleEditScriptName,
}) {
  const handleWrongMessage = (value) => {
    setMsg(value);
  };
  return (
    <div>
      <Modal
        isOpen={open}
        style={{ maxWidth: "700px" }}
        className="modal-setting"
      >
        <ModalBody>
          <div className="script-name-section">
            <div className="title-m title">
              <span>Script information</span>
            </div>
            <InputTitleTextArea
              title={"Script's name"}
              placeHolder={"Enter script name..."}
              val={scriptName}
              func={handleEditScriptName}
            />
          </div>
          <div className="script-name-section">
            <div className="title-m title">
              <span>Script's setting</span>
            </div>
            <InputTitle
              title={"Wrong message"}
              placeHolder={"Enter wrong message..."}
              val={message || ""}
              func={handleWrongMessage}
            />
            <InputTitle
              title={"End conversation message"}
              placeHolder={"Enter end conversation message"}
              val={messageEnd || ""}
              func={(value) => {
                setMsg(message, value);
              }}
            />
          </div>
        </ModalBody>
        <div className="close-button" onClick={closeModalSetting}>
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      </Modal>
    </div>
  );
}

export default ModalSetting;
