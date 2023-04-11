import { Table, Button } from "reactstrap";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { DELETE, GET, POST } from "../../functionHelper/APIFunction";
import { BASE_URL } from "../../global/globalVar";
import { NotificationManager } from "react-notifications";
import { Breadcrumb } from "antd";
import "../../styles/common.css";
import Filter from "../Filter/Filter";
import SearchBar from "../Filter/SearchBar";
import LoadingAnt from "../Loading/LoadingAnt";
import AddEntityModal from "../Modal/AddEntityModal";
function EntityTable() {
  const [entity, setEntity] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);

  const loadEntity = (page, pageSize) => {
    let body = {
      page: page,
      size: pageSize,
    };
    POST(BASE_URL + "api/entity_type/", JSON.stringify(body))
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        setEntity(res.items);
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
    loadEntity(1, 12);
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
    POST(BASE_URL + `api/entity_type/`, JSON.stringify(body)).then((res) => {
      //   res.items.map((item) => {
      //     const createdDate = new Date(item.created_date);
      //     const updatedDate = new Date(item.last_updated_date);
      //     item.created_date = createdDate.toLocaleString("en-US");
      //     item.last_updated_date = updatedDate.toLocaleString("en-US");
      //     return item;
      //   });
      setEntity(res.items);
      setPagination({
        totalItem: res.total_items,
        totalPage: res.total_pages,
      });
    });
  };
  const handleToggleModal = (val) => {
    setOpenAddModal(!openAddModal);
    if (val) {
      let body = {
        name: val,
      };
      POST(BASE_URL + "api/entity_type/add", JSON.stringify(body))
        .then((res) => {
          if (res.http_status !== "OK") throw res;
          loadEntity(1, 12);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const handleDelete = (id) => {
    let body = {
      ids: [id],
    };
    DELETE(BASE_URL + "api/entity_type/delete", JSON.stringify(body))
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Entity</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => {
            handleToggleModal();
          }}
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
          <SearchBar func={handleFilter} />
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
                Entity name
              </th>
              <th style={{ width: "15%" }}>
                <span className="vertical" />
                <i className="fa-regular fa-square-minus"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {entity.map((entity, idx) => {
              return (
                <tr key={entity.id}>
                  <td>{++idx}</td>
                  <td>{entity.name}</td>
                  <td className="d-flex action-row">
                    <div
                      onClick={() => {
                        alert("dang loi =)");
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square text-primary"></i>
                    </div>

                    <div
                      onClick={() => {
                        handleDelete(entity.id);
                      }}
                    >
                      <i className="fa-regular fa-trash-can text-danger"></i>
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
          defaultCurrent={2}
          total={pagination.totalItem}
          pagesize={12}
          onChange={loadEntity}
        />
      </div>
      <AddEntityModal open={openAddModal} toggle={handleToggleModal} />
    </>
  );
}

export default EntityTable;
