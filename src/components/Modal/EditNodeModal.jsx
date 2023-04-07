import {
  Modal,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  ModalHeader,
} from "reactstrap";
import "./css/EditNodeModal.css";
import InputTitleTextArea from "../Input/InputTitleTextArea";
import { useEffect, useState } from "react";

function EditNodeModal({ open, toggle, nodeData }) {
  console.log("data in modal", nodeData);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentSelectedCondition, setCurrentSelectedCondition] = useState({});
  const [conditionMapping, setConditionMapping] = useState([]);
  const [message, setMessage] = useState(nodeData.message);

  useEffect(() => {
    setConditionMapping(nodeData.conditions);
  }, [nodeData]);

  const toggleDropDown = () => setDropdownOpen((prevState) => !prevState);

  const clearSelected = () => {
    let items = document.querySelectorAll(".condition-item");
    items.forEach((item) => {
      item.classList.remove("selected-condition-item");
    });
  };
  const handleSelected = (id) => {
    clearSelected();
    console.log("selected", id);
    let item = document.querySelector(".conditionId-" + id);
    console.log("selected item", item);

    item.classList.add("selected-condition-item");
    setCurrentSelectedCondition({
      id: id,
      currentSelectedType: item.getAttribute("value"),
    });
  };
  const handleEditKeyword = (value) => {
    setConditionMapping(
      conditionMapping.map((cd) => {
        if (cd.id === currentSelectedCondition.id) {
          cd.keyword = value;
        }
        return cd;
      })
    );
    nodeData.setKeyword({
      conditionId: currentSelectedCondition.id,
      keyword: value,
    });
  };

  const getIntentName = (id) => {
    return nodeData.intents.filter((intent) => intent.id === id).length !== 0
      ? nodeData.intents.filter((intent) => intent.id === id)[0].name
      : "Choose intent";
  };
  const getIntentCode = (id) => {
    return nodeData.intents.filter((intent) => intent.id === id).length !== 0
      ? nodeData.intents.filter((intent) => intent.id === id)[0].code
      : "Choose_intent";
  };

  const getCurrentKeywordValue = (id) => {
    return conditionMapping.filter((cdn) => cdn.id === id).length !== 0
      ? conditionMapping.filter((cdn) => cdn.id === id)[0].keyword
      : "";
  };

  const getIntentNameByConditionId = (conditionId) => {
    return conditionMapping.filter((cdn) => cdn.id === conditionId).length !== 0
      ? conditionMapping.filter((cdn) => cdn.id === conditionId)[0].intent_id
      : "ChooseIntent";
  };
  return (
    <div>
      <Modal isOpen={open} className="edit-node-modal">
        <ModalHeader className="modal-header">Edit node</ModalHeader>
        <ModalBody style={{ background: "#fcfdfd" }}>
          <div className="containerModal">
            <div>
              <InputTitleTextArea
                title={"Message"}
                placeHolder={"Enter message..."}
                val={message}
                func={(value) => {
                  setMessage(value);
                  nodeData.handleSetMessage(value);
                }}
              />
            </div>
            <div className="node-info-section row">
              <div className="condition-section col-5">
                <div className="title">Customer's response</div>
                <div className="condition-items-section">
                  {conditionMapping.map((condition, index) => {
                    if (condition.predict_type === "INTENT") {
                      return (
                        <div
                          className={
                            "conditionId-" + condition.id + " condition-item"
                          }
                          key={index}
                          id={condition.id}
                          onClick={() => {
                            handleSelected(condition.id);
                          }}
                          value={"intent"}
                        >
                          <div className="row">
                            <div className="intent-name col-9">
                              {getIntentName(condition.intent_id)}
                            </div>
                            <input
                              type="text"
                              value={"intent"}
                              hidden
                              readOnly
                            />
                            <div className="col-3 d-flex justify-content-end">
                              <div
                                className="delete-intent"
                                onClick={() =>
                                  nodeData.deleteCondition(condition.id)
                                }
                              >
                                <i className="fa-solid fa-xmark delete-icon"></i>
                              </div>
                            </div>
                          </div>
                          <div className="intent-code ">
                            {getIntentCode(condition.intent_id)}
                          </div>
                        </div>
                      );
                    }
                    if (condition.predict_type === "KEYWORD") {
                      return (
                        <div
                          className={
                            "conditionId-" + condition.id + " condition-item"
                          }
                          key={condition.id}
                          id={condition.id}
                          onClick={() => {
                            handleSelected(condition.id);
                          }}
                          value={"keyword"}
                        >
                          <div className="row">
                            <div className="intent-name col-9">Keyword</div>
                            <div className="col-3 d-flex justify-content-end">
                              <div
                                className="delete-intent"
                                onClick={() =>
                                  nodeData.deleteCondition(condition.id)
                                }
                              >
                                <i className="fa-solid fa-xmark delete-icon"></i>
                              </div>
                            </div>
                          </div>
                          <div className="intent-code keywordValue">
                            {condition.keyword}
                          </div>
                        </div>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </div>

                <div className="btn-section">
                  <Button
                    outline
                    className="add-btn"
                    onClick={() => {
                      nodeData.addIntent();
                    }}
                  >
                    Add intent
                  </Button>
                  <Button
                    outline
                    className="add-btn"
                    onClick={() => {
                      nodeData.addKeyword();
                    }}
                  >
                    Add keyword
                  </Button>
                </div>
              </div>
              <div className="condition-info-section col-7">
                {currentSelectedCondition.currentSelectedType === "keyword" ? (
                  <div className="intent-choice">
                    <div className="input-title">Keyword *</div>
                    <input
                      type="search"
                      className="input-keyword"
                      placeholder="Enter keyword..."
                      onChange={(e) => {
                        handleEditKeyword(e.target.value);
                      }}
                      value={getCurrentKeywordValue(
                        currentSelectedCondition.id
                      )}
                    />
                  </div>
                ) : currentSelectedCondition.currentSelectedType ===
                  "intent" ? (
                  <div className="intent-choice">
                    <div className="input-title">
                      Topic / Intent <span className="text-danger">*</span>
                    </div>
                    <Dropdown
                      isOpen={dropdownOpen}
                      toggle={toggleDropDown}
                      className="dropdown"
                    >
                      <DropdownToggle caret className="dropdown-toggle">
                        <div>
                          <i className="fa-solid fa-link icon-item"></i>
                          {getIntentName(
                            getIntentNameByConditionId(
                              currentSelectedCondition.id
                            )
                          )}
                        </div>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu shadow">
                        {nodeData.intents.map((intent, idx) => {
                          return (
                            <>
                              <DropdownItem
                                key={idx}
                                value={intent.id}
                                onClick={() => {
                                  nodeData.setIntent({
                                    conditionId: currentSelectedCondition.id,
                                    intentId: intent.id,
                                    intentName: intent.name,
                                  });
                                }}
                                className="d-flex justify-content-start item-dropdown"
                              >
                                <i className="fa-solid fa-link icon-item"></i>

                                <div>{intent.name}</div>
                              </DropdownItem>
                            </>
                          );
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <div className="close-button" onClick={() => toggle()}>
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      </Modal>
    </div>
  );
}
export default EditNodeModal;
