import { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { Modal, ModalBody, Table, ModalFooter, Button } from "reactstrap";
import { POST } from "../../functionHelper/APIFunction";
import ChatHistory from "../Chat/ChatContent/ChatHistory";
import { Pagination } from "antd";
import "../../styles/common.css";
import "./css/ChatHistoryModal.css";
import { BASE_URL } from "../../global/globalVar";
function ChatHistoryModal({ open, toggle, scriptId, entityType }) {
  const [currentSessionDetail, setCurrentSessionDetail] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isFullDetail, setIsFullDetail] = useState(true);
  const [currentEntityDetail, setCurrentEntityDetail] = useState([]);
  const [maxCol, setMaxCol] = useState(0);
  const loadMessageHistory = (page, pageSize) => {
    let body = {
      page: page,
      size: pageSize,
      script_id: scriptId,
      has_message_entity_histories: true,
    };
    POST(BASE_URL + "api/message_history_group/", JSON.stringify(body))
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        res.items.map((item) => {
          const createdDate = new Date(item.created_date);
          item.created_date = createdDate.toLocaleString("en-US");
          return item;
        });
        setMessageHistory(res.items);
        setPagination({
          totalItem: res.total_items,
          totalPage: res.total_pages,
        });
        setMaxCol(findMaxCol(res.items));
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error("Some things went wrong!!", "Error");
      });
  };

  const findMaxCol = (items) => {
    let max = 0;
    items.forEach((item) => {
      if (item.hasOwnProperty("message_entity_histories")) {
        if (item.message_entity_histories.length > max) {
          max = item.message_entity_histories.length;
        }
      }
    });
    return max;
  };

  useEffect(() => {
    loadMessageHistory(1, 15);
  }, [toggle]);

  const loadDetailMessage = (sessionId, scriptId) => {
    let body = {
      page: 1,
      size: 100,
      session_id: sessionId,
      script_id: scriptId,
    };

    Promise.all([
      POST(BASE_URL + "api/message_history/", JSON.stringify(body)),
      POST(BASE_URL + "api/message_entity_history/", JSON.stringify(body)),
    ])
      .then((res) => {
        if (res[0].http_status !== "OK" || res[1].http_status !== "OK")
          throw res;
        setCurrentSessionDetail(res[0].items);
        console.log("type", entityType);
        let entities = entityType.map((item) => {
          let temp;
          res[1].items.forEach((entity) => {
            if (item.id === entity.entity_type_id) {
              temp = {
                entityType: item.name,
                value: entity.values.toString(),
              };
            }
          });
          return temp;
        });
        entities = entities.filter((item) => item);
        setCurrentEntityDetail(entities);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error("Some things went wrong!!", "Error");
      });
  };
  const handleSelected = (id) => {
    setIsFullDetail(false);
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
  const handleJumpPagination = (page, pageSize) => {
    loadMessageHistory(page, pageSize);
  };
  return (
    <div>
      <Modal isOpen={open} className="chat-history-modal">
        <ModalBody>
          <div className="row modal-row">
            <div
              className={
                isFullDetail ? "session-list col-12" : "session-list col-5"
              }
            >
              <div className="row">
                <div className="col-4"></div>
                <div className="header-history col-4">Chat history</div>
                <div className="col-4 text-right mt-2">
                  <div
                    className="fullscreen"
                    onClick={() => {
                      setIsFullDetail((preState) => !preState);
                    }}
                  >
                    {isFullDetail ? (
                      <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
                    ) : (
                      <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                    )}
                  </div>
                </div>
              </div>
              <Table borderless hover responsive className="tableData">
                <thead style={{ background: "#f6f9fc" }}>
                  <tr>
                    <th style={{ width: "3%" }}>#</th>
                    <th style={{ width: "20%" }}>
                      <span className="vertical" />
                      Session id
                    </th>
                    <th style={{ width: "30%" }}>
                      <span className="vertical" />
                      Created at
                    </th>
                    {!isFullDetail ? (
                      <></>
                    ) : (
                      [...Array(maxCol)].map((e, i) => (
                        <th>
                          <span className="vertical" />
                          Entity {++i}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {messageHistory.map((item, idx) => {
                    return (
                      <tr className={"item-" + item.id} key={idx}>
                        <td>{++idx}</td>
                        <td
                          onClick={() => {
                            loadDetailMessage(item.session_id, item.script_id);
                            handleSelected(item.id);
                          }}
                        >
                          {item.session_id}
                        </td>
                        <td
                          onClick={() => {
                            loadDetailMessage(item.session_id, item.script_id);
                            handleSelected(item.id);
                          }}
                        >
                          {item.created_date}
                        </td>
                        {!isFullDetail ? (
                          <></>
                        ) : !item.hasOwnProperty("message_entity_histories") ? (
                          [...Array(maxCol)].map((e, i) => (
                            <td
                              onClick={() => {
                                loadDetailMessage(
                                  item.session_id,
                                  item.script_id
                                );
                                handleSelected(item.id);
                              }}
                            ></td>
                          ))
                        ) : (
                          item.message_entity_histories.map((entity) => {
                            return (
                              <td
                                onClick={() => {
                                  loadDetailMessage(
                                    item.session_id,
                                    item.script_id
                                  );
                                  handleSelected(item.id);
                                }}
                              >
                                {entity.values.toString()}
                              </td>
                            );
                          })
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {messageHistory.length === 0 ? (
                <div className="d-flex justify-content-center text-secondary">
                  No data to show...
                </div>
              ) : (
                <></>
              )}
              <Pagination
                showQuickJumper
                defaultCurrent={1}
                total={pagination.totalItem}
                pageSize={15}
                onChange={handleJumpPagination}
              />
            </div>
            <div className={isFullDetail ? "d-none" : "col-4 set-height"}>
              <div style={{ paddingTop: "5px" }}>
                <ChatHistory messageData={currentSessionDetail} />
              </div>
            </div>
            <div
              className={
                isFullDetail ? "d-none" : "col-3 set-height list-entity"
              }
            >
              <div className="header-history-sub">List of entity</div>
              <Table borderless hover responsive className="tableData">
                <thead style={{ background: "#f6f9fc" }}>
                  <tr>
                    <th style={{ width: "30%" }}>Entity type</th>
                    <th>
                      <span className="vertical" />
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntityDetail.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{item.entityType}</td>
                        <td>{item.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
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
