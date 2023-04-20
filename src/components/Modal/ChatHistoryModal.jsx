import { useState, useEffect } from "react";
import { getCookie } from "../../functionHelper/GetSetCookie";
import Code from "../../global/Code";
import { NotificationManager } from "react-notifications";
import { Modal, ModalBody, Table, ModalFooter, Button } from "reactstrap";
import { GET, POST, UPLOAD } from "../../functionHelper/APIFunction";
import ChatHistory from "../Chat/ChatContent/ChatHistory";
import "../../styles/common.css";
import "./css/ChatHistoryModal.css";
import { BASE_URL } from "../../global/globalVar";
function ChatHistoryModal({ open, toggle }) {
  const [currentSessionDetail, setCurrentSessionDetail] = useState([]);
  const loadDetailMessage = (sessionId, scriptId) => {
    let body = {
      page: 1,
      size: 100,
      session_id: sessionId,
      script_id: scriptId,
    };
    POST(BASE_URL + "api/message_history/", JSON.stringify(body))
      .then((res) => {
        if (res.http_status === "OK") {
          setCurrentSessionDetail(res.items);
        }
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error("Some things went wrong!!", "Error");
      });
  };
  const handleSelected = (id) => {
    let selectedList = document.querySelectorAll(".history-selected");
    if (selectedList.length === 0) {
      document.querySelector(".item-" + id).classList.add("history-selected");
    } else {
      document
        .querySelector(".history-selected")
        .classList.remove("history-selected");
      document.querySelector(".item-" + id).classList.add("history-selected");
    }
  };
  return (
    <div>
      {" "}
      <Modal isOpen={open} className="chat-history-modal">
        <ModalBody>
          <div className="row modal-row">
            <div className="col-5 session-list">
              <div className="header-history">Chat history</div>
              <Table borderless hover responsive className="tableData">
                <thead style={{ background: "#f6f9fc" }}>
                  <tr>
                    <th>#</th>
                    <th>
                      <span className="vertical" />
                      Session id
                    </th>
                    <th>
                      <span className="vertical" />
                      Entity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={"item-627505610752"}>
                    <td>1</td>
                    <td
                      onClick={() => {
                        loadDetailMessage(
                          "1410826127865",
                          "64323b382350023ad68d7c21"
                        );
                        handleSelected("627505610752");
                      }}
                    >
                      627505610752
                    </td>
                    <td>An</td>
                  </tr>
                  <tr className={"item-735731668671"}>
                    <td>2</td>
                    <td
                      onClick={() => {
                        loadDetailMessage(
                          "735731668671",
                          "64323b382350023ad68d7c21"
                        );
                        handleSelected("735731668671");
                      }}
                    >
                      627505610752
                    </td>
                    <td>do</td>
                  </tr>
                  {/* {intents.map((intent, idx) => {
                    return (
                      <tr key={intent.id}>
                        <td>{++idx}</td>
                        <td
                        >
                          {intent.name}
                        </td>
                        <td>{intent.created_date}</td>
                        <td className="d-flex action-row">
                          <div
                          >
                            <i className="fa-solid fa-pen-to-square text-primary"></i>
                          </div>
                          <div
                          >
                            <i className="fa-solid fa-trash-can text-danger"></i>
                          </div>
                        </td>
                      </tr>
                    );
                  })} */}
                </tbody>
              </Table>
            </div>
            <div className="col-4">
              <div>
                <ChatHistory messageData={currentSessionDetail} />
              </div>
            </div>
            <div className="col-3">
              <div className="header-history">List of entity</div>
            </div>
          </div>
        </ModalBody>
        <div
          className="close-button"
          onClick={() => {
            toggle();
            setCurrentSessionDetail([]);
          }}
          style={{ left: "100%", marginLeft: "10px" }}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      </Modal>
    </div>
  );
}

export default ChatHistoryModal;
