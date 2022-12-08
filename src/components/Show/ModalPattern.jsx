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
function ModalPattern({ open, toggle, value }) {
  console.log("va", value);
  const [patterns, setPatterns] = useState([]);
  const [isShowInput, setShowInput] = useState(false);
  const [currentPattern, setCurrentPattern] = useState({});
  const [content, setContent] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({});
  useEffect(() => {
    setPatterns(value.patterns.items);
    setPagination({ totalPage: value.patterns.total_pages });
  }, [value.patterns.items]);

  const handleShowInput = () => {
    if (isShowInput && content !== "") {
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
    setShowInput(!isShowInput);
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
      <Modal isOpen={open} style={{ maxWidth: "700px" }}>
        <ModalHeader>Pattern</ModalHeader>
        <ModalBody>
          <Button
            color="primary"
            style={{ minWidth: "110px" }}
            onClick={handleShowInput}
          >
            {isShowInput ? "Save" : "Create new"}
          </Button>
          <Input
            style={{
              width: "80%",
              marginLeft: "10px",
              display: isShowInput ? "inline" : "none",
            }}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <Table striped bordered hover className="tableData">
            <thead>
              <tr>
                <th>Content</th>
                <th className="text-center" style={{ width: "15%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((pattern) => {
                return (
                  <tr key={pattern.id}>
                    <td>{pattern.content}</td>
                    <td className="text-center">
                      <div
                        className="actionTable"
                        style={{ background: "#28B463" }}
                      >
                        <i
                          className="fa-solid fa-pen-to-square text-white"
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
                        className="actionTable"
                        onClick={() => {
                          handleDeletePattern(pattern.id);
                        }}
                      >
                        <i className="fa-solid fa-trash-can text-white"></i>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {console.log("page", pagination)}
          <Pagination aria-label="Page navigation example">
            {Array.from(
              { length: pagination.totalPage > 17 ? 17 : pagination.totalPage },
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
