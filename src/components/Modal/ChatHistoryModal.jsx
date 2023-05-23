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
  const [dataTable, setDataTable] = useState([]);
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
        setDataTable(convertToTable(res.items));
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error("Some things went wrong!!", "Error");
      });
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
  const convertToTable = (messageHistory) => {
    // messageHistory
    // entityType.map
    let lst = messageHistory.map((messHistory) => {
      let entities = entityType.map((entity) => {
        if (messHistory.hasOwnProperty("message_entity_histories")) {
          let val = messHistory.message_entity_histories.filter(
            (his) => his.entity_type_id === entity.id
          );
          if (val.length > 0) {
            return val[0].hasOwnProperty("values")
              ? val[0].values.toString()
              : "";
          } else {
            return "";
          }
        } else {
          return "";
        }
      });

      console.log("ebti", entities);
      return {
        id: messHistory.id,
        script_id: messHistory.script_id,
        session_id: messHistory.session_id,
        created_date: messHistory.created_date,
        entities: entities,
      };
    });
    console.log("Settable");
    return lst;
  };
  return (
    <div>
      <Modal isOpen={open} className="chat-history-modal">
        <ModalBody>
          <div className="row modal-row">
            <div
              className={
                isFullDetail ? "session-list col-12" : "session-list1 col-5"
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
              <div className="scrollable">
                <Table borderless hover className="tableData1" scrollAble>
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
                        // [...Array(maxCol)].map((e, i) => (
                        //   <th>
                        //     <span className="vertical" />
                        //     Entity {++i}
                        //   </th>
                        // ))
                        entityType.map((item) => (
                          <th style={{}} className="">
                            <span className="vertical" />
                            {item.name}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {console.log("king", dataTable)}
                    {dataTable.map((item, idx) => {
                      return (
                        <tr className={"item-" + item.id} key={idx}>
                          <td>{++idx}</td>
                          <td
                            onClick={() => {
                              loadDetailMessage(
                                item.session_id,
                                item.script_id
                              );
                              handleSelected(item.id);
                            }}
                          >
                            {item.session_id}
                          </td>
                          <td
                            onClick={() => {
                              loadDetailMessage(
                                item.session_id,
                                item.script_id
                              );
                              handleSelected(item.id);
                            }}
                          >
                            {item.created_date}
                          </td>
                          {!isFullDetail ? (
                            <></>
                          ) : (
                            item.entities.map((enti, idx) => {
                              return (
                                <td
                                  onClick={() => {
                                    loadDetailMessage(
                                      item.session_id,
                                      item.script_id
                                    );
                                    handleSelected(item.id);
                                  }}
                                  key={idx}
                                >
                                  {enti}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
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
