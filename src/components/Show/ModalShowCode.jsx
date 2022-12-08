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
          <Input
            type="textarea"
            name="text"
            id="codeText"
            value={getCode()}
            style={{ minHeight: "550px" }}
            readOnly
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              Copy();
            }}
          >
            Copy
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              toggle();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalShowCode;
