import { useState, useEffect, useCallback } from "react";
import { GET, POST, DELETE } from "../../functionHelper/APIFunction";
import ModalUpdatePattern from "./ModalUpdatePattern";
import { NotificationManager } from "react-notifications";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Pagination } from "antd";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { BASE_URL } from "../../global/globalVar";
import "../../styles/common.css";
import Filter from "../Filter/Filter";
import SearchBar from "../Filter/SearchBar";
import "./css/ModalPattern.css";
import InputTitle from "../Input/InputTitle";
import uniqueID from "../../functionHelper/GenerateID";
import { render } from "@testing-library/react";
function ModalPattern({ open, toggle, value }) {
  const [patterns, setPatterns] = useState([]);
  const [currentPattern, setCurrentPattern] = useState({});
  const [content, setContent] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const [key, setKey] = useState("pattern-list");
  const [entityType, setEntityType] = useState([]);
  const [entityTypeValue, setEntityValue] = useState("");
  const [entities, setEntities] = useState([]);
  const [currentEntityValue, setCurrentEntityValue] = useState({});
  const [isShowEntityTypeSelection, setShowEntityTypeSelection] =
    useState(false);
  const [searchEntityTypeValue, setSearchEntityTypeValue] = useState("");
  useEffect(() => {
    value.patterns.items.map((item) => {
      const createdDate = new Date(item.created_date);
      const updatedDate = new Date(item.last_updated_date);
      item.created_date = createdDate.toLocaleString("en-US");
      item.last_updated_date = updatedDate.toLocaleString("en-US");
      return item;
    });
    setPatterns(value.patterns.items);
    setPagination({
      totalItem: value.patterns.total_items,
      totalPage: value.patterns.total_pages,
    });
  }, [value.patterns.items]);

  const loadEntityType = (page, pageSize) => {
    let body = {
      page: page,
      size: pageSize,
    };
    POST(BASE_URL + "api/entity_type/", JSON.stringify(body))
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        setEntityType(res.items);
        console.log("entype", res.items);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    loadEntityType(1, 100);
  }, []);
  const handleCreatePattern = () => {
    console.log("value of", entities);
    if (content !== "") {
      let body = {
        content: content,
        intent_id: value.intentID,
        entities: entities,
      };
      POST(BASE_URL + "api/pattern/add", JSON.stringify(body)).then((res) => {
        if (res.http_status === "OK") {
          NotificationManager.success("Created successfully!!", "Success");
          reloadPattern();
        }
      });
    }
    setContent("");
    setEntities([]);
  };

  const reloadPattern = (page, pageSize = 10) => {
    if (page === undefined) page = 1;
    GET(
      BASE_URL +
        "api/pattern/get_pagination/by_intent_id/" +
        value.intentID +
        "?page=" +
        page +
        "&size=" +
        pageSize
    ).then((res) => {
      res.items.map((item) => {
        const createdDate = new Date(item.created_date);
        const updatedDate = new Date(item.last_updated_date);
        item.created_date = createdDate.toLocaleString("en-US");
        item.last_updated_date = updatedDate.toLocaleString("en-US");
        return item;
      });
      setPatterns(res.items);
      setPagination({
        totalItem: res.total_items,
        totalPage: res.total_pages,
      });
    });
  };
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  const handleUpdate = (id, content) => {
    let body = {
      id: id,
      content: content,
    };
    POST(BASE_URL + "api/pattern/update", JSON.stringify(body))
      .then((res) => {
        if (res.http_status === "OK") {
          setOpenModal(!openModal);
          reloadPattern();
          NotificationManager.success("Update successfully", "success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeletePattern = (id) => {
    let body = {
      id: id,
    };
    POST(BASE_URL + "api/pattern/delete", JSON.stringify(body))
      .then((res) => {
        NotificationManager.success("Delete successfully", "success");
        reloadPattern();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilter = ({ val, date }) => {
    let body = {
      page: 1,
      size: 12,
      // keyword: val,
    };
    if (date) {
      let fromDate = new Date(date.fromDate + " 00:00:00");
      let toDate = new Date(date.toDate + " 23:59:59");
      body.date_filters = [
        {
          field_name: "created_date",
          from_date: fromDate * 1,
          to_date: toDate * 1,
        },
      ];
    }
    if (val) {
      body.keyword = val;
    }
    POST(BASE_URL + `api/pattern/get_pagination/`, JSON.stringify(body)).then(
      (res) => {
        res.items.map((item) => {
          const createdDate = new Date(item.created_date);
          const updatedDate = new Date(item.last_updated_date);
          item.created_date = createdDate.toLocaleString("en-US");
          item.last_updated_date = updatedDate.toLocaleString("en-US");
          return item;
        });
        setPatterns(res.items);
        setPagination({
          totalItem: res.total_items,
          totalPage: res.total_pages,
        });
      }
    );
  };
  const handleJumpPagination = (page, pageSize) => {
    reloadPattern(page, pageSize);
  };
  const onChangeEntityTypeValue = (val) => {
    setEntityValue(val);
  };
  const handleCreateEntityType = () => {
    if (entityTypeValue) {
      let body = {
        name: entityTypeValue,
      };
      POST(BASE_URL + "api/entity_type/add", JSON.stringify(body))
        .then((res) => {
          if (res.http_status !== "OK") throw res;
          NotificationManager.success("Created successfully", "Success");
          loadEntityType(1, 12);
          setEntityValue("");
        })
        .catch((e) => {
          if (e.exception_code === "name_exist") {
            NotificationManager.error("Entity name already exist!", "Error");
          }
          console.log(e);
        });
    }
  };
  const getSelectedText = () => {
    let text = document.getElementById("pattern-name");
    let selection = text.value.substr(
      text.selectionStart,
      text.selectionEnd - text.selectionStart
    );

    console.log("rrrr", selection);
    if (selection !== "") {
      setShowEntityTypeSelection(true);
      setCurrentEntityValue({
        value: selection,
        startPosition: text.selectionStart,
        endPosition: text.selectionEnd - 1,
      });
    } else {
      setCurrentEntityValue({});
      setShowEntityTypeSelection(false);
    }
  };
  const handleChooseEntityType = (entityType) => {
    let checkEntity = false;
    if (currentEntityValue.value) {
      entities.forEach((entity) => {
        if (
          entityType.name === entity.entityType &&
          currentEntityValue.value === entity.value &&
          entity.start_position === currentEntityValue.startPosition &&
          entity.end_position === currentEntityValue.endPosition
        ) {
          NotificationManager.error("Entity already exist!!", "Error");
          checkEntity = true;
        }
      });
      if (!checkEntity) {
        const entity = {
          id: uniqueID(),
          entityType: entityType.name,
          entity_type_id: entityType.id,
          value: currentEntityValue.value,
          start_position: currentEntityValue.startPosition,
          end_position: currentEntityValue.endPosition,
        };
        setEntities((entities) => [...entities, entity]);
        setShowEntityTypeSelection(false);
      }
    }
  };
  const handleDeleteEntity = (id) => {
    setEntities((entities) => entities.filter((entity) => entity.id !== id));
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
    console.log("search", value);
    let body = {
      page: 1,
      size: 100,
      keyword: value,
    };
    POST(BASE_URL + "api/entity_type/", JSON.stringify(body))
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        setEntityType(res.items);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Modal
        isOpen={open}
        style={{ maxWidth: "1000px" }}
        className="patternModal"
      >
        <ModalHeader>Pattern information</ModalHeader>
        <ModalBody style={{ padding: "10px 30px", minHeight: "750px" }}>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="pattern-list" title="Patterns">
              <Filter func={handleFilter} />

              <div className="shadow-sm table-area">
                <div className="header-Table">
                  <SearchBar func={handleFilter} />
                  <span className="total-script">
                    Total:{pagination.totalItem} Patterns
                  </span>
                </div>
                <Table borderless hover responsive className="tableData">
                  <thead style={{ background: "#f6f9fc" }}>
                    <tr>
                      <th>#</th>
                      <th>
                        <span className="vertical" />
                        Content
                      </th>
                      <th>
                        <span className="vertical" />
                        Created at
                      </th>
                      <th style={{ width: "15%" }}>
                        <span className="vertical" />
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patterns.map((pattern, idx) => {
                      return (
                        <tr key={pattern.id}>
                          <td>{++idx}</td>
                          <td>{pattern.content}</td>
                          <td>{pattern.created_date}</td>
                          <td className="d-flex action-row">
                            <div>
                              <i
                                className="fa-solid fa-pen-to-square text-primary"
                                onClick={() => {
                                  handleToggleModal();
                                  setCurrentPattern({
                                    id: pattern.id,
                                    content: pattern.content,
                                  });
                                }}
                              ></i>
                            </div>
                            <div
                              onClick={() => {
                                handleDeletePattern(pattern.id);
                              }}
                            >
                              <i className="fa-solid fa-trash-can text-danger"></i>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Pagination
                  showQuickJumper
                  defaultCurrent={1}
                  total={pagination.totalItem}
                  pageSize={10}
                  onChange={handleJumpPagination}
                />
              </div>
            </Tab>
            <Tab eventKey="add-pattern" title="Create pattern">
              <div className="createPatternSection">
                <div className="patternInputArea" id="searchArea">
                  <i className="fa-solid fa-circle-plus"></i>
                  <input
                    type="search"
                    className="patternInput"
                    placeholder="Enter pattern..."
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                    id="pattern-name"
                    onSelect={getSelectedText}
                    autoComplete="off"
                  />
                </div>
                <Button
                  style={{ background: "#56cc6e", border: "none" }}
                  onClick={handleCreatePattern}
                >
                  Create
                </Button>
              </div>
              <div
                className="select-entity-section"
                style={{
                  display: isShowEntityTypeSelection ? "block" : "none",
                }}
              >
                <div className="row">
                  <i
                    class="fa-solid fa-circle-xmark text-danger closeEntityOption"
                    onClick={() => {
                      setShowEntityTypeSelection(false);
                    }}
                  ></i>
                  <div className="col-6 show-entity-type">
                    <div className="searchEntityType d-flex justify-content-center">
                      <div
                        className="searchArea"
                        id="searchArea"
                        style={{ width: "89%" }}
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
                    <div className="entity-type-items">
                      {entityType.map((item) => {
                        return (
                          <div
                            className="entity-type-item"
                            key={item.id}
                            onClick={() =>
                              handleChooseEntityType({
                                id: item.id,
                                name: item.name,
                              })
                            }
                          >
                            <span>{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-6 create-entity-type">
                    <div className="title">Object / Entity</div>
                    <InputTitle
                      title={"Entity name"}
                      placeHolder={"Enter entity name..."}
                      val={entityTypeValue}
                      func={onChangeEntityTypeValue}
                    />
                    <div className="d-flex justify-content-end">
                      <Button
                        style={{ background: "#56cc6e", border: "none" }}
                        onClick={handleCreateEntityType}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="entity-container">
                <div className="row entity-header">
                  <div className="col-5">Entity type</div>
                  <div className="col-5">Value</div>
                  <div className="col-2">Action</div>
                </div>
                <div className="entity-item-section">
                  {entities.length === 0 ? (
                    <span className="empty">
                      Highlight the keyword in the input to add entity
                    </span>
                  ) : (
                    entities.map((item) => {
                      return (
                        <div className="row entity-item" key={item.id}>
                          <div className="col-5">{item.entityType}</div>
                          <div className="col-5">{item.value}</div>
                          <div className="col-2 d-flex justify-content-end  align-items-center">
                            <i
                              class="fa-solid fa-circle-xmark text-danger"
                              onClick={() => {
                                handleDeleteEntity(item.id);
                              }}
                            ></i>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              toggle(value.intentID);
              setContent("");
              setEntities([]);
            }}
            className="closeBtn"
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <ModalUpdatePattern
        open={openModal}
        toggle={handleToggleModal}
        value={currentPattern}
        update={handleUpdate}
      />
    </>
  );
}

export default ModalPattern;
