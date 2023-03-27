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
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { BASE_URL } from "../../global/globalVar";
import "../../styles/common.css";
import filterIcon from "../../assets/filter.png";
import clearFilter from "../../assets/clear-filter.png";

function ModalPattern({ open, toggle, value }) {
  const [patterns, setPatterns] = useState([]);
  const [currentPattern, setCurrentPattern] = useState({});
  const [content, setContent] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({});
  useEffect(() => {
    setPatterns(value.patterns.items);
    setPagination({ totalPage: value.patterns.total_pages });
  }, [value.patterns.items]);

  const handleCreatePattern = () => {
    if (content !== "") {
      let body = {
        content: content,
        intent_id: value.intentID,
      };
      POST(BASE_URL + "api/pattern/add", JSON.stringify(body)).then((res) => {
        if (res.http_status === "OK") {
          reloadPattern();
        }
      });
    }
    setContent("");
  };

  const reloadPattern = (page) => {
    if (page === undefined) page = 1;
    GET(
      BASE_URL +
        "api/pattern/get_pagination/by_intent_id/" +
        value.intentID +
        "?page=" +
        page +
        "&size=10"
    ).then((res) => {
      setPatterns(res.items);
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
  return (
    <>
      <Modal
        isOpen={open}
        style={{ maxWidth: "1000px" }}
        className="patternModal"
      >
        <ModalHeader>Pattern information</ModalHeader>
        <ModalBody style={{ padding: "10px 30px" }}>
          <div className="createPatternSection">
            <div className="patternInputArea" id="searchArea">
              <i class="fa-solid fa-circle-plus"></i>
              <input
                type="search"
                className="patternInput"
                placeholder="Create new pattern..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </div>
            <Button
              style={{ background: "#56cc6e", border: "none" }}
              onClick={handleCreatePattern}
            >
              Create
            </Button>
          </div>
          <div className="filter-section">
            <div className="filter-section">
              <div className="filterIcon">
                <img src={filterIcon} alt="" style={{ width: "15px" }} />
              </div>
              <div className="dateTime-picker">
                <span>Date created</span>
                <i
                  class="fa-solid fa-caret-down"
                  style={{ marginLeft: "5px" }}
                ></i>
              </div>
            </div>
            <img src={clearFilter} style={{ width: "18px", display: "end" }} />
          </div>
          <div className="shadow-sm table-area">
            <div className="header-Table">
              <div
                className="searchArea"
                id="searchArea"
                style={{ width: "300px" }}
              >
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                  type="search"
                  className="searchInput searchInputTable"
                  placeholder="Find your scripts..."
                  for="searchArea"
                />
              </div>
              <span className="total-script">
                Total:{patterns.length} Patterns
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
            <Pagination aria-label="Page navigation example">
              {Array.from(
                {
                  length: pagination.totalPage > 17 ? 17 : pagination.totalPage,
                },
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => {
                        reloadPattern(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            </Pagination>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              toggle(value.intentID);
            }}
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
