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
import { useEffect, useState } from "react";
import { GET, POST } from "../../functionHelper/APIFunction";
import ModalUpdateIntent from "../Show/ModalUpdateIntent";
import ModalPattern from "../Show/ModalPattern";

function EditNodeModal({ open, toggle, nodeData }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentSelectedCondition, setCurrentSelectedCondition] = useState({});
  const [conditionMapping, setConditionMapping] = useState([]);
  const [message, setMessage] = useState(nodeData.message);
  const [isToggleEntityType, setToggleEntityType] = useState(false);
  const [currentCursor, setCurrentCursor] = useState("");
  const [searchEntityTypeValue, setSearchEntityTypeValue] = useState("");
  const [entityType, setEntityType] = useState([]);
  const [isOpenEditIntent, setOpenEditIntent] = useState(false);
  const [isOpenModalPattern, setOpenModalPattern] = useState(false);
  const [currentIntent, setCurrentIntent] = useState("");

  useEffect(() => {
    setConditionMapping(nodeData.conditions);
    setEntityType(nodeData.entityType);
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
  const handleChooseEntityType = (entityType) => {
    let messageBeforeCursor = message.substring(0, currentCursor);
    let messageAfterCursor = message.substring(currentCursor, message.length);
    let insertString = "{{" + entityType + "}}";
    let text = messageBeforeCursor + insertString + messageAfterCursor;
    setMessage(text);
    nodeData.handleSetMessage(text);
    setToggleEntityType(false);
    document.querySelector(".inputArea").focus();
  };
  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSearchEntityType(e.target.value);
    }
  };
  const handleClearInput = (e) => {
    setSearchEntityTypeValue(e.target.value);
    if (e.target.value === "") {
      handleSearchEntityType("");
    }
  };
  const handleSearchEntityType = (value) => {
    let body = {
      page: 1,
      size: 100,
      keyword: value,
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/entity_type/",
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        setEntityType(res.items);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleOpenAddIntent = () => {
    setOpenEditIntent(!isOpenEditIntent);
  };

  const handleReloadIntent = (pageNum, pageSize, intent) => {
    GET(
      process.env.REACT_APP_BASE_URL + `api/intent/get_all/by_user_id`,
      JSON.stringify({})
    )
      .then((res) => {
        nodeData.reloadIntents(res.intents);
        setCurrentIntent(intent.id);
        handleOpenAddPattern();

        nodeData.setIntent({
          conditionId: currentSelectedCondition.id,
          intentId: intent.id,
          intentName: intent.name,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleOpenAddPattern = () => {
    setOpenModalPattern(!isOpenModalPattern);
  };
  return (
    <div>
      <Modal isOpen={open} className="edit-node-modal">
        <ModalHeader className="modal-header">Edit node</ModalHeader>
        <ModalBody style={{ background: "#fcfdfd" }}>
          <div className="containerModal">
            <div>
              <div className="input-area" style={{ margin: "0px" }}>
                <div className="inputTitle">Message</div>
                <textarea
                  style={{ scrollbarWidth: "none" }}
                  type="search"
                  className="input inputArea"
                  placeholder={"Enter message..."}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    nodeData.handleSetMessage(e.target.value);
                  }}
                  onSelect={(e) => {
                    setCurrentCursor(e.target.selectionStart);
                  }}
                  value={message}
                />
                <div className="d-flex" style={{ alignItems: "center" }}>
                  <div className="title-variable">Using variable:</div>
                  <div className="variable-section">
                    <div
                      className="variable-item"
                      onClick={() =>
                        setToggleEntityType((preState) => !preState)
                      }
                    >
                      Entity
                    </div>
                    <div
                      className="select-entity-section"
                      style={{
                        width: "50%",
                        position: "absolute",
                        display: isToggleEntityType ? "block" : "none",
                      }}
                    >
                      <i
                        class="fa-solid fa-circle-xmark text-danger closeEntityOption closeEntityOptionn"
                        onClick={() => {
                          setToggleEntityType(false);
                        }}
                      ></i>
                      <div className="show-entity-type show-entity-typee">
                        <div className="searchEntityType d-flex justify-content-center">
                          <div
                            className="searchArea"
                            id="searchArea"
                            style={{ width: "100%" }}
                          >
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                              type="search"
                              className="searchInput searchInputTable"
                              placeholder="Find your records..."
                              value={searchEntityTypeValue}
                              onKeyDown={(e) => handleKey(e)}
                              onChange={(e) => handleClearInput(e)}
                            />
                          </div>
                        </div>
                        <div className="entity-type-items entity-type-itemss">
                          {entityType.map((item) => {
                            return (
                              <div
                                className="entity-type-item"
                                key={item.id}
                                onClick={() =>
                                  handleChooseEntityType(item.name)
                                }
                              >
                                <i className="fa-solid fa-user icon-entity"></i>
                                <span>{item.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="node-info-section row">
              <div className="condition-section col-5">
                <div className="title">Customer's response</div>
                <div
                  className="condition-items-section"
                  style={{ overflowX: "hidden", maxHeight: "550px" }}
                >
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
                  <>
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
                          <div
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              maxWidth: "100%",
                            }}
                          >
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
                    <Button
                      className="btn-add"
                      style={{
                        marginLeft: "0px",
                        width: "100%",
                        marginTop: "10px",
                      }}
                      onClick={handleOpenAddIntent}
                    >
                      New Intent
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <div
          className="close-button"
          onClick={() => {
            toggle();
            setToggleEntityType(false);
            setSearchEntityTypeValue("");
          }}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      </Modal>
      {isOpenEditIntent ? (
        <ModalUpdateIntent
          open={isOpenEditIntent}
          toggle={handleOpenAddIntent}
          value={{ name: "", code: "", type: "save" }}
          reload={handleReloadIntent}
        />
      ) : (
        <></>
      )}
      <ModalPattern
        open={isOpenModalPattern}
        toggle={handleOpenAddPattern}
        value={{
          intentID: currentIntent,
          patterns: { items: [] },
        }}
      />
    </div>
  );
}
export default EditNodeModal;
