import { useState, useEffect } from "react";
import $ from "jquery";
import { getCookie } from "../../functionHelper/GetSetCookie";
import Code from "../../global/Code";
import { NotificationManager } from "react-notifications";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import "../../styles/common.css";
function ModalShowCode({ open, toggle, scriptID }) {
  const getCode = () => {
    let codee = Code()
      .replace("SECRETKEY_REPLACE", getCookie("secret_key"))
      .replace("SCRIPTID_REPLACE", scriptID);
    return codee;
  };
  const Copy = () => {
    navigator.clipboard.writeText($("#codeText").val());
    NotificationManager.success("Copied", "success");
  };
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalHeader>Code</ModalHeader>
        <ModalBody>
          <textarea
            type="textarea"
            name="text"
            id="codeText"
            value={getCode()}
            style={{
              minHeight: "550px",
              scrollbarWidth: "none",
              width: "100%",
            }}
            readOnly
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              Copy();
            }}
            className="btn-prim"
            style={{ width: "95px" }}
          >
            <i
              class="fa-solid fa-file-import"
              style={{ marginRight: "10px" }}
            ></i>
            Copy
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              toggle();
            }}
            className="closeBtn"
            style={{ width: "95px" }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalShowCode;
