import { Table, Button } from "reactstrap";
import { Pagination, theme } from "antd";
import { useEffect, useState } from "react";
import { GET, POST } from "../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import { Breadcrumb } from "antd";
import "../../styles/common.css";
import Filter from "../Filter/Filter";
import SearchBar from "../Filter/SearchBar";
import LoadingAnt from "../Loading/LoadingAnt";
import AddEntityModal from "../Modal/AddEntityModal";
import ShowEntityModal from "../Modal/ShowEntityModal";
import UpdateEntityModal from "../Modal/UpdateEntityModal";
function EntityTable() {
  const [entity, setEntity] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEntityModal, setOpenEntityModal] = useState(false);
  const [openUpdateEntityModal, setOpenUpdateEntityModal] = useState(false);
  const [currentEntity, setCurrentEntity] = useState("");
  const [currentEntityType, setCurrentEntityType] = useState({});

  const loadEntity = (page, pageSize) => {
    let body = {
      page: page,
      size: pageSize,
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/entity_type/",
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        res.items.map((item) => {
          const createdDate = new Date(item.created_date);
          const updatedDate = new Date(item.last_updated_date);
          item.created_date = createdDate.toLocaleString("en-US");
          item.last_updated_date = updatedDate.toLocaleString("en-US");
          return item;
        });
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
      POST(
        process.env.REACT_APP_BASE_URL + "api/entity_type/add",
        JSON.stringify(body)
      )
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
    POST(
      process.env.REACT_APP_BASE_URL + "api/entity_type/delete",
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.http_status === "OK") {
          loadEntity(1, 12);
          NotificationManager.success("Deleted successfully", "Success");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleToggleEntityModal = (id) => {
    setCurrentEntity(id);
    setOpenEntityModal(!openEntityModal);
  };
  const handleToggleUpdateEntityModal = (name, entityTypeId) => {
    entityTypeId && entityTypeId
      ? setCurrentEntityType({ id: entityTypeId, name: name })
      : setCurrentEntityType({});
    setOpenUpdateEntityModal(!openUpdateEntityModal);
  };
  const handleUpdateEntityType = (name, entityTypeId) => {
    let body = {
      id: entityTypeId,
      name: name,
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/entity_type/update",
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.http_status === "OK") {
          NotificationManager.success("Updated successfully!!", "Success");
          loadEntity(1, 12);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    handleToggleUpdateEntityModal();
  };
  return (
    <>
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Entity type</Breadcrumb.Item>
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
              <th>
                <span className="vertical" />
                Created date
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
                  <td
                    onClick={() => {
                      handleToggleEntityModal(entity.id);
                    }}
                  >
                    {++idx}
                  </td>
                  <td
                    onClick={() => {
                      handleToggleEntityModal(entity.id);
                    }}
                  >
                    {entity.name}
                  </td>
                  <td
                    onClick={() => {
                      handleToggleEntityModal(entity.id);
                    }}
                  >
                    {entity.created_date}
                  </td>
                  <td className="d-flex action-row">
                    <div
                      onClick={() => {
                        handleToggleUpdateEntityModal(entity.name, entity.id);
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
      <ShowEntityModal
        open={openEntityModal}
        toggle={handleToggleEntityModal}
        entityId={currentEntity}
      />
      <UpdateEntityModal
        open={openUpdateEntityModal}
        toggle={handleToggleUpdateEntityModal}
        entityType={currentEntityType}
        func={handleUpdateEntityType}
      />
    </>
  );
}

export default EntityTable;
