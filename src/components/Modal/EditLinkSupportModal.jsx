import { useState, useEffect } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import InputTitle from "../../components/Input/InputTitle";
import "../../styles/common.css";
function EditLinkSupportModal({ open, toggle, data, handleSaveLinkSupport }) {
  const [zaloLink, setZaloLink] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const handleSetZaloLink = (value) => {
    setZaloLink(value);
  };
  const handleSetMeetLink = (value) => {
    setMeetLink(value);
  };
  useEffect(() => {
    setZaloLink(data.zalo_group_link);
    setMeetLink(data.google_meet_link);
  }, [data]);
  return (
    <div>
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalBody>
          <InputTitle
            placeHolder={"Enter link zalo support"}
            title={"Zalo link support"}
            val={zaloLink}
            func={handleSetZaloLink}
          />
          <InputTitle
            placeHolder={"Enter link google meet support"}
            title={"Google meet link support"}
            val={meetLink}
            func={handleSetMeetLink}
          />
          <div className="d-flex justify-content-end">
            <Button
              className="btn-prim"
              onClick={() => {
                setZaloLink("");
                setMeetLink("");
                handleSaveLinkSupport({
                  userId: data.userId,
                  zalo_group_link: zaloLink,
                  google_meet_link: meetLink,
                });
              }}
            >
              Save
            </Button>
            <Button
              className="closeBtn"
              onClick={() => {
                setZaloLink("");
                setMeetLink("");
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

export default EditLinkSupportModal;
