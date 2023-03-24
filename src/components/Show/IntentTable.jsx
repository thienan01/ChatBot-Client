import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
} from "reactstrap";
import { useEffect, useState } from "react";
import { GET, POST } from "../../functionHelper/APIFunction";
import { BASE_URL } from "../../global/globalVar";
import ModalUpdateIntent from "./ModalUpdateIntent";
import ModalPattern from "./ModalPattern";
import { NotificationManager } from "react-notifications";
import "../../styles/common.css";
import filterIcon from "../../assets/filter.png";
import clearFilter from "../../assets/clear-filter.png";
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
  const [pagination, setPagination] = useState({});
  const getIntent = (page) => {
    if (page === undefined) page = 1;

    GET(
      BASE_URL +
        `api/intent/get_pagination/by_user_id?page=` +
        page +
        `&size=12`
    ).then((res) => {
      console.log(res);
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
        console.log(res);
        setPatterns({ intentID: intentID, patterns: res });
      })
      .catch((err) => {
        NotificationManager.error("Some things went wrong!", "success");
        console.log(err);
      });
  };

  useEffect(() => getIntent(), []);

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
          getIntent();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTrain = () => {
    POST(BASE_URL + "api/training/train", JSON.stringify({})).then((res) => {});
  };

  const handleCheckStatusInterval = () => {
    let checking = setInterval(() => {
      GET(BASE_URL + "api/training/get_server_status")
        .then((res) => {
          if (res.http_status === "OK" && res.status === "FREE") {
            NotificationManager.success("Training finished", "success");
            setIsTraining(false);
            clearInterval(checking);
          }
        })
        .catch((err) => {
          NotificationManager.error("Some things when  wrong!", "error");
        });
    }, 4000);
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

  return (
    <>
      <div className="btn-section">
        <div>
          <Button
            className="btn-table btn-prim"
            onClick={() => {
              handleTrain();
              setIsTraining(true);
              handleCheckStatusInterval();
            }}
          >
            {isTraining ? (
              <Spinner
                style={{
                  width: "16px",
                  height: "16px",
                  fontSize: "10px",
                  marginRight: "5px",
                }}
              />
            ) : (
              "Train"
            )}
          </Button>
          <Button
            className="btn-table btn-prim"
            onClick={() => {
              handleCheckStatus();
            }}
          >
            Check status
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
      <div className="filter-section">
        <div className="filter-section">
          <div className="filterIcon">
            <img src={filterIcon} alt="" style={{ width: "15px" }} />
          </div>
          <div className="dateTime-picker">
            <span>Date created</span>
            <i class="fa-solid fa-caret-down" style={{ marginLeft: "5px" }}></i>
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
              className="searchInput"
              placeholder="Find your scripts..."
              for="searchArea"
            />
          </div>
          <span className="total-script">Total: {intents.length} Intents</span>
        </div>
        <Table borderless hover responsive className="tableData">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <span className="vertical" />
                Intent name
              </th>
              <th>
                <span className="vertical" />
                Code
              </th>
              <th style={{ width: "15%" }}>
                <span className="vertical" />
                <i class="fa-regular fa-square-minus"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {intents.map((intent, idx) => {
              return (
                <tr key={intent.id}>
                  <td>{++idx}</td>
                  <td>{intent.name}</td>
                  <td>{intent.code}</td>
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
                        handleTogglePattern(intent.id);
                      }}
                    >
                      <i
                        className="fa-regular fa-eye "
                        style={{ color: "#56cc6e" }}
                      ></i>
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

        <Pagination aria-label="Page navigation example">
          {Array.from({ length: pagination.totalPage }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => {
                  getIntent(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </Pagination>

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
