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
import Filter from "../Filter/Filter";
import SearchBar from "../Filter/SearchBar";

function ModalPattern({ open, toggle, value }) {
  const [patterns, setPatterns] = useState([]);
  const [currentPattern, setCurrentPattern] = useState({});
  const [content, setContent] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({});
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
            onClick={() => {
              toggle(value.intentID);
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
