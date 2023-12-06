import { Table, Button } from "reactstrap";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { GET, POST } from "../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import { Breadcrumb } from "antd";
import "../../styles/common.css";
import Filter from "../Filter/Filter";
import SearchBar from "../Filter/SearchBar";
import LoadingAnt from "../Loading/LoadingAnt";
import EditLinkSupportModal from "../Modal/EditLinkSupportModal";
function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isOpenEditLinkModal, setOpenEditLinkModal] = useState(false);
  const [currentLinkData, setCurrentLinkData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = (page, pageSize, keyword) => {
    setCurrentPage(page);
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
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    loadUsers(1, 10);
  }, []);

  const handleFilter = ({ val, date }) => {
    let body = {
      page: 1,
      size: 12,
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
    POST(
      process.env.REACT_APP_BASE_URL + `api/entity_type/`,
      JSON.stringify(body)
    ).then((res) => {
      res.items.map((item) => {
        const createdDate = new Date(item.created_date);
        const updatedDate = new Date(item.last_updated_date);
        item.created_date = createdDate.toLocaleString("en-US");
        item.last_updated_date = updatedDate.toLocaleString("en-US");
        return item;
      });
      setUsers(res.items);
      setPagination({
        totalItem: res.total_items,
        totalPage: res.total_pages,
      });
    });
  };

  const handleToggleEditLinkModal = (linkData) => {
    if (linkData) {
      setCurrentLinkData(linkData);
    }
    setOpenEditLinkModal(!isOpenEditLinkModal);
  };
  const handleSaveLinkSupport = (data) => {
    setOpenEditLinkModal(!isOpenEditLinkModal);
    let body = {
      user_id: data.userId,
      zalo_group_link: data.zalo_group_link,
      google_meet_link: data.google_meet_link,
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/admin/user/update-user-info",
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.http_status === "OK") {
          NotificationManager.success("Save successfully", "Success");
          loadUsers(currentPage, 10);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearchUser = (keyword) => {
    loadUsers(1, 10, keyword.val);
  };
  return (
    <>
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Entity type</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => {}}
          className="btn-table"
          style={{ background: "#56cc6e", border: "none" }}
        >
          <i className="fa-solid fa-plus" style={{ marginRight: "4px" }}></i>
          Create
        </Button>
      </div>

      <Filter func={handleFilter} />

      <div className="shadow-sm table-area">
        <div className="header-Table">
          <SearchBar func={handleSearchUser} />
          <span className="total-script">
            Total:{pagination.totalItem} Patterns
          </span>
        </div>
        <Table borderless hover responsive className="tableData">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <span className="vertical" />
                Username
              </th>
              <th>
                <span className="vertical" />
                Full name
              </th>
              <th>
                <span className="vertical" />
                Package
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
                  <td onClick={() => {}}>{++idx}</td>
                  <td onClick={() => {}}>{user.username}</td>
                  <td onClick={() => {}}>{user.fullname}</td>
                  <td onClick={() => {}}>{user.current_service_pack}</td>
                  <td className="d-flex action-row">
                    <div
                      onClick={() => {
                        handleToggleEditLinkModal({
                          userId: user.id,
                          zalo_group_link: user.zalo_group_link,
                          google_meet_link: user.google_meet_link,
                        });
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square text-primary"></i>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div
          className="d-flex justify-content-center"
          style={{ width: "100%" }}
        >
          <LoadingAnt display={isLoading} />
        </div>

        <Pagination
          showQuickJumper
          defaultCurrent={1}
          total={pagination.totalItem}
          pagesize={12}
          onChange={loadUsers}
        />
        <EditLinkSupportModal
          open={isOpenEditLinkModal}
          toggle={handleToggleEditLinkModal}
          handleSaveLinkSupport={handleSaveLinkSupport}
          data={currentLinkData}
        ></EditLinkSupportModal>
      </div>
    </>
  );
}

export default UserManagementTable;
