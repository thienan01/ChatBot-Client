import { Table, Button } from "reactstrap";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { GET, POST } from "../../functionHelper/APIFunction";
import { BASE_URL } from "../../global/globalVar";
import ModalUpdateIntent from "./ModalUpdateIntent";
import ModalPattern from "./ModalPattern";
import { NotificationManager } from "react-notifications";
import "../../styles/common.css";
import Filter from "../Filter/Filter";
import { Breadcrumb } from "antd";
import SearchBar from "../Filter/SearchBar";
import LoadingAnt from "../Loading/LoadingAnt";
function IntentTable() {
  const [intents, setIntents] = useState([]);
  const [patterns, setPatterns] = useState({
    intentID: "",
    patterns: { items: [] },
  });
  const [currentIntent, setCurrentIntent] = useState({});
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openPatternModal, setOpenPatternModal] = useState(false);
  const [createIntent, setCreateIntent] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const getIntent = (page, pageSize) => {
    if (page === undefined) page = 1;

    GET(
      BASE_URL +
        `api/intent/get_pagination/by_user_id?page=` +
        page +
        `&size=` +
        pageSize
    ).then((res) => {
      res.items.map((item) => {
        const createdDate = new Date(item.created_date);
        const updatedDate = new Date(item.last_updated_date);
        item.created_date = createdDate.toLocaleString("en-US");
        item.last_updated_date = updatedDate.toLocaleString("en-US");
        return item;
      });
      setLoading(false);
      setIntents(res.items);
      setPagination({
        totalItem: res.total_items,
        totalPage: res.total_pages,
      });
    });
  };

  const getPattern = (intentID, page) => {
    GET(
      BASE_URL +
        "api/pattern/get_pagination/by_intent_id/" +
        intentID +
        "?page=" +
        page +
        "&size=10"
    )
      .then((res) => {
        setPatterns({ intentID: intentID, patterns: res });
      })
      .catch((err) => {
        NotificationManager.error("Some things went wrong!", "success");
        console.log(err);
      });
  };

  useEffect(() => getIntent(1, 12), []);

  const handleToggleUpdateIntent = (id, name, code, type) => {
    setOpenUpdateModal(!openUpdateModal);
    setCurrentIntent({ id, name, code, type });
  };
  const handleTogglePattern = (intentID) => {
    setOpenPatternModal(!openPatternModal);
    getPattern(intentID, 1);
  };
  const handleDeleteIntent = (id) => {
    let body = {
      id: id,
    };
    POST(BASE_URL + "api/intent/delete", JSON.stringify(body))
      .then((res) => {
        if (res.http_status === "OK") {
          NotificationManager.success("Delete successfully", "success");
          getIntent(1, 12);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckStatus = () => {
    GET(BASE_URL + "api/training/get_server_status")
      .then((res) => {
        if (res.http_status === "OK" && res.status === "FREE") {
          NotificationManager.success("Training finished", "success");
        }
        if (res.http_status === "OK" && res.status === "BUSY") {
          NotificationManager.warning(
            "Training, Please wait for a minute!",
            "warning"
          );
        }
      })
      .catch((err) => {
        NotificationManager.error("Some things when  wrong!", "error");
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
    POST(BASE_URL + `api/intent/get_pagination/`, JSON.stringify(body)).then(
      (res) => {
        res.items.map((item) => {
          const createdDate = new Date(item.created_date);
          const updatedDate = new Date(item.last_updated_date);
          item.created_date = createdDate.toLocaleString("en-US");
          item.last_updated_date = updatedDate.toLocaleString("en-US");
          return item;
        });
        setIntents(res.items);
        setPagination({
          totalItem: res.total_items,
          totalPage: res.total_pages,
        });
      }
    );
  };
  const handleTrain = () => {
    POST(BASE_URL + "api/training/train", JSON.stringify({})).then((res) => {});
  };
  const handleJumpPagination = (page, pageSize) => {
    getIntent(page, pageSize);
  };
  return (
    <>
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Intents</Breadcrumb.Item>
      </Breadcrumb>

      <div className="btn-section">
        <div>
          <Button
            className="btn-table btn-prim"
            onClick={() => {
              handleCheckStatus();
            }}
          >
            Check status
          </Button>
          <Button
            className="btn-table btn-prim"
            onClick={() => {
              handleTrain();
            }}
          >
            Train
          </Button>
        </div>
        <Button
          onClick={() => {
            handleToggleUpdateIntent("", "", "", "save");
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
            Total: {pagination.totalItem} Intents
          </span>
        </div>

        <Table borderless hover responsive className="tableData">
          <thead style={{ background: "#f6f9fc" }}>
            <tr>
              <th>#</th>
              <th>
                <span className="vertical" />
                Intent name
              </th>
              <th>
                <span className="vertical" />
                Created at
              </th>
              <th style={{ width: "15%" }}>
                <span className="vertical" />
                <i className="fa-regular fa-square-minus"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {intents.map((intent, idx) => {
              return (
                <tr key={intent.id}>
                  <td>{++idx}</td>
                  <td
                    onClick={() => {
                      handleTogglePattern(intent.id);
                    }}
                  >
                    {intent.name}
                  </td>
                  <td>{intent.created_date}</td>
                  <td className="d-flex action-row">
                    <div
                      onClick={() => {
                        handleToggleUpdateIntent(
                          intent.id,
                          intent.name,
                          intent.code
                        );
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square text-primary"></i>
                    </div>
                    <div
                      onClick={() => {
                        handleDeleteIntent(intent.id);
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
        <div className="d-flex justify-content-center">
          <LoadingAnt display={isLoading} />
        </div>
        <Pagination
          showQuickJumper
          defaultCurrent={1}
          total={pagination.totalItem}
          pageSize={12}
          onChange={handleJumpPagination}
        />

        <ModalUpdateIntent
          open={openUpdateModal}
          toggle={handleToggleUpdateIntent}
          value={currentIntent}
          create={createIntent}
          reload={getIntent}
          // save={handleSaveIntent}
        />
        <ModalPattern
          open={openPatternModal}
          toggle={handleTogglePattern}
          value={patterns}
        />
      </div>
    </>
  );
}

export default IntentTable;
