import { useState, useEffect } from "react";
import { POST } from "../../functionHelper/APIFunction";
import { Button, Modal, ModalHeader, ModalBody, Table } from "reactstrap";
import { Pagination } from "antd";

import "../../styles/common.css";
import SearchBar from "../Filter/SearchBar";
import { setCookie } from "../../functionHelper/GetSetCookie";

function FilterUerModal({ open, toggle }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});

  const loadUser = (page, pageSize, keyword) => {
    let body = {
      page: page,
      size: pageSize,
      keyword: keyword,
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/admin/user/get_pagination",
      JSON.stringify(body)
    )
      .then((res) => {
        setUsers(res.items);
        setPagination({
          totalItem: res.total_items,
          totalPage: res.total_pages,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    loadUser(1, 10);
  }, [open]);
  const handleFilter = (val) => {
    loadUser(1, 10, val.val);
  };
  const handleSelectUser = (user) => {
    setCookie("filterUser", JSON.stringify(user), 3);
    toggle(user, "Search");
  };
  return (
    <>
      <Modal
        isOpen={open}
        style={{ maxWidth: "1000px" }}
        className="patternModal"
      >
        <ModalHeader>Filter user</ModalHeader>
        <ModalBody>
          <div className="shadow-sm table-area">
            <div className="header-Table">
              <SearchBar func={handleFilter} />
              <span className="total-script">
                {/* Total:{pagination.totalItem} Patterns */}
              </span>
            </div>
            <Table borderless hover responsive className="tableData">
              <thead style={{ background: "#f6f9fc" }}>
                <tr>
                  <th>#</th>
                  <th>
                    <span className="vertical" />
                    Username
                  </th>
                  <th>
                    <span className="vertical" />
                    Fullname
                  </th>
                  <th>
                    <span className="vertical" />
                    Current package
                  </th>
                  <th style={{ width: "15%" }}>
                    <span className="vertical" />
                    <i className="fa-regular fa-square-minus"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  return (
                    <tr key={user.id}>
                      <td>{++idx}</td>
                      <td>
                        {user.hasOwnProperty("username")
                          ? user.username
                          : "Missing data"}
                      </td>
                      <td>
                        {user.hasOwnProperty("fullname")
                          ? user.fullname
                          : "Missing data"}
                      </td>
                      <td>
                        {user.hasOwnProperty("current_service_pack")
                          ? user.current_service_pack
                          : "Missing data"}
                      </td>
                      <td className="d-flex action-row">
                        <div
                          onClick={() => {
                            handleSelectUser(user);
                          }}
                        >
                          <i class="fa-solid fa-computer-mouse text-primary"></i>
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
              onChange={loadUser}
            />
          </div>
          <div className="d-flex justify-content-end pt-3">
            <Button
              onClick={() => {
                toggle({}, "Search");
              }}
              className="closeBtn"
            >
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default FilterUerModal;
