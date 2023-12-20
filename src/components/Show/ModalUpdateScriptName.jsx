import { useState, useEffect } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { POST, PUT } from "../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import InputTitle from "../Input/InputTitle";

function ModalUpdateScriptName({ open, toggle, data, reload }) {
  const [name, setName] = useState(data.name);
  const handleSave = () => {
    let body = {
      name: name,
    };
    let url = "api/script/" + data.id + "/update_name";
    POST(process.env.REACT_APP_BASE_URL + url, JSON.stringify(body))
      .then((res) => {
        reload(1, 12);
        toggle();
        NotificationManager.success("Update successfully", "success");
      })
      .catch((err) => {
        NotificationManager.error("Update fail", "error");
        toggle();
        console.log(err);
      });
  };

  const handleScriptName = (value) => {
    setName(value);
  };
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalBody>
          <span className="title">Update script name</span>
          <InputTitle
            title={"Script name"}
            placeHolder={"Enter script name..."}
            val={name}
            func={handleScriptName}
          />
          <div className="d-flex justify-content-end">
            <Button className="btn-prim" onClick={handleSave}>
              Save
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

export default ModalUpdateScriptName;
