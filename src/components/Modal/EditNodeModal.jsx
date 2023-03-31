import {
  Modal,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Button,
} from "reactstrap";
import "./css/EditNodeModal.css";
import InputTitleTextArea from "../Input/InputTitleTextArea";
import { useState } from "react";
import uniqueID from "../../functionHelper/GenerateID";

let items = [
  {
    id: uniqueID(),
    intent_name: "Hỏi giá",
    intent_code: "Hoi_gia",
    intent_type: "INTENT",
  },
  {
    id: uniqueID(),
    intent_type: "KEYWORD",
    keyword: "Màu đỏ",
  },
];
function EditNodeModal({ open }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [conditionItems, setConditionItems] = useState(items);
  const [currentSelectType, setCurrentSelectedType] = useState("");
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleAddIntent = () => {
    let newIntent = {
      id: uniqueID(),
      intent_name: "Choose intent",
      intent_code: "Choose_intent",
      intent_type: "INTENT",
    };
    setConditionItems([...conditionItems, newIntent]);
  };

  const handleAddKeyword = () => {
    let newKeyword = {
      id: uniqueID(),
      intent_type: "KEYWORD",
      keyword: "Choose keyword",
    };
    setConditionItems([...conditionItems, newKeyword]);
  };

  const removeCondition = (conditionId) => {
    console.log(conditionId);
    setConditionItems(
      conditionItems.filter((condition) => condition.id !== conditionId)
    );
  };
  const handleSelected = (id) => {
    let items = document.querySelectorAll(".condition-item");
    items.forEach((item) => {
      item.classList.remove("selected");
    });
    let item = document.getElementById(id);
    item.classList.add("selected");
    setCurrentSelectedType(item.getAttribute("value"));
  };
  return (
    <div>
      {console.log(conditionItems)}
      <Modal isOpen={true} className="edit-node-modal">
        <ModalBody>
          <div>
            <Label>Edit node</Label>
          </div>
          <div className="containerModal">
            <div>
              <InputTitleTextArea title={"Message"} />
            </div>
            <div className="node-info-section row">
              <div className="condition-section col-5">
                <div>Customer response</div>
                <div className="condition-items-section">
                  {conditionItems.map((condition) => {
                    if (condition.intent_type === "INTENT") {
                      return (
                        <div
                          className="condition-item"
                          key={condition.id}
                          id={condition.id}
                          onClick={() => {
                            handleSelected(condition.id);
                          }}
                          value={"intent"}
                        >
                          <div className="row">
                            <div className="intent-name col-9">
                              {condition.intent_name}
                            </div>
                            <input type="text" value={"intent"} hidden />
                            <div className="col-3 d-flex justify-content-end">
                              <div
                                className="delete-intent"
                                onClick={() => removeCondition(condition.id)}
                              >
                                <i className="fa-solid fa-xmark delete-icon"></i>
                              </div>
                            </div>
                          </div>
                          <div className="intent-code ">
                            {condition.intent_code}
                          </div>
                        </div>
                      );
                    }
                    if (condition.intent_type === "KEYWORD") {
                      return (
                        <div
                          className="condition-item"
                          key={condition.id}
                          id={condition.id}
                          onClick={() => {
                            handleSelected(condition.id);
                          }}
                          value={"keyword"}
                        >
                          <div className="row">
                            <div className="intent-name col-9">
                              {condition.keyword}
                            </div>
                            <div className="col-3 d-flex justify-content-end">
                              <div
                                className="delete-intent"
                                onClick={() => removeCondition(condition.id)}
                              >
                                <i className="fa-solid fa-xmark delete-icon"></i>
                              </div>
                            </div>
                          </div>
                          <div className="intent-code ">
                            {condition.keyword}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="btn-section">
                  <Button outline className="add-btn" onClick={handleAddIntent}>
                    Add intent
                  </Button>
                  <Button
                    outline
                    className="add-btn"
                    onClick={handleAddKeyword}
                  >
                    Add keyword
                  </Button>
                </div>
              </div>
              <div className="condition-info-section col-7">
                {currentSelectType === "intent" ? (
                  <div className="intent-choice">
                    <div className="input-title">Intent *</div>
                    <Dropdown
                      isOpen={dropdownOpen}
                      toggle={toggle}
                      className="dropdown"
                    >
                      <DropdownToggle caret className="dropdown-toggle">
                        Choose intent
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu shadow">
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Action</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                ) : (
                  <div className="intent-choice">
                    <div className="input-title">Keyword *</div>
                    <input type="search" className="input-keyword" />
                  </div>
                )}
                {/* <div className="intent-choice">
                  <div className="input-title">Intent *</div>
                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={toggle}
                    className="dropdown"
                  >
                    <DropdownToggle caret className="dropdown-toggle">
                      Choose intent
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu shadow">
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Action</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="intent-choice">
                  <div className="input-title">Keyword *</div>
                  <input type="search" className="input-keyword" />
                </div> */}
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default EditNodeModal;
