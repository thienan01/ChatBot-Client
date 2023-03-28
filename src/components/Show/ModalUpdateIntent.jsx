import { useState, useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import { POST } from "../../functionHelper/APIFunction";
import { BASE_URL } from "../../global/globalVar";
import { NotificationManager } from "react-notifications";
import InputTitle from "../Input/InputTitle";
function ModalUpdateIntent({ open, toggle, value, reload }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  useEffect(() => {
    setName(value.name);
    setCode(value.code);
  }, [value.name, value.code]);

  const genCode = (val) => {
    return val.replaceAll(" ", "_");
  };

  const handleSave = () => {
    let body = {
      id: value.id,
      code: code,
      name: name,
    };
    let url = value.type === "save" ? "api/intent/add" : "api/intent/update";
    POST(BASE_URL + url, JSON.stringify(body))
      .then((res) => {
        reload();
        toggle();
        NotificationManager.success("Update successfully", "success");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function removeAccents(str) {
    if (str === undefined) return "";
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ",
      "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ",
    ];
    console.log(str);
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
  const handleIntentName = (value) => {
    console.log("alo");
    setName(value);
    setCode(removeAccents(genCode(value)));
  };
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalBody>
          <span className="title">Update intent</span>
          <InputTitle
            title={"Intent name"}
            placeHolder={"Enter intent name..."}
            val={name}
            func={handleIntentName}
          />
          <InputTitle
            title={"Code"}
            placeHolder={"Code will be converted automatically.."}
            readOnly={true}
            val={code}
          />

          <div className="d-flex justify-content-end">
            <Button className="btn-prim" onClick={handleSave}>
              Save
            </Button>
            <Button
              className="closeBtn"
              onClick={() => {
                toggle(value.id);
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

export default ModalUpdateIntent;
