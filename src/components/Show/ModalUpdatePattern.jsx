import { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { GET, POST } from "../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import uniqueID from "../../functionHelper/GenerateID";
import InputTitle from "../Input/InputTitle";
function ModalUpdatePattern({
  open,
  toggle,
  value,
  update,
  entityType,
  loadEntityType,
  handleSearchEntityType,
}) {
  const [content, setContent] = useState("");
  const [isShowEntityTypeSelection, setShowEntityTypeSelection] =
    useState(false);
  const [entityTypeValue, setEntityValue] = useState("");
  const [currentEntityValue, setCurrentEntityValue] = useState({});
  const [entities, setEntities] = useState([]);
  const [searchEntityTypeValue, setSearchEntityTypeValue] = useState("");
  const [patternDetail, setPatternDetail] = useState({});
  useEffect(() => {
    handleLoadPattern();
  }, [value]);

  const handleLoadPattern = () => {
    GET(process.env.REACT_APP_BASE_URL + "api/pattern/get/" + value.id)
      .then((res) => {
        setPatternDetail(res);
        setContent(res.content);
        if (res.hasOwnProperty("entities")) {
          let entities = res.entities.map((entity) => {
            entityType.forEach((item) => {
              if (item.id === entity.entity_type_id) {
                entity.entityType = item.name;
              }
            });
            return entity;
          });
          setEntities(entities);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleCreateEntityType = () => {
    if (entityTypeValue) {
      let body = {
        name: entityTypeValue,
      };
      POST(
        process.env.REACT_APP_BASE_URL + "api/entity_type/add",
        JSON.stringify(body)
      )
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
    let text = document.getElementById("pattern-name-update");
    let selection = text.value.substr(
      text.selectionStart,
      text.selectionEnd - text.selectionStart
    );

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
  const handleUpdate = () => {
    let pattern = {
      id: patternDetail.id,
      content: content,
      entities: entities,
    };
    update(pattern);
  };
  return (
    <div>
      <Modal
        isOpen={open}
        style={{ maxWidth: "700px" }}
        className="modal-update-pattern"
      >
        <ModalHeader>Update pattern</ModalHeader>
        <ModalBody>
          <div className="createPatternSection" style={{ height: "50px" }}>
            <div
              className="patternInputArea"
              style={{ width: "100%" }}
              id="searchArea"
            >
              <i className="fa-solid fa-circle-plus"></i>
              <input
                type="search"
                className="patternInput"
                placeholder="Enter pattern name..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                id="pattern-name-update"
                onSelect={getSelectedText}
                autoComplete="off"
              />
            </div>
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
                style={{ right: "-92%" }}
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
                  func={(val) => {
                    setEntityValue(val);
                  }}
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
                            setEntities((entities) =>
                              entities.filter((entity) => entity.id !== item.id)
                            );
                          }}
                        ></i>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end pt-3">
            <Button
              style={{ background: "#56cc6e", border: "none" }}
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button
              className="closeBtn"
              onClick={toggle}
              style={{ marginLeft: "10px" }}
            >
              Close
            </Button>
          </div>
        </ModalBody>
        {/* <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              update(value.id, content);
            }}
          >
            Save
          </Button>
          <Button
            style={{ background: "#56cc6e", border: "none" }}
            // onClick={handleCreatePattern}
          >
            Update
          </Button>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter> */}
      </Modal>
    </div>
  );
}

export default ModalUpdatePattern;
