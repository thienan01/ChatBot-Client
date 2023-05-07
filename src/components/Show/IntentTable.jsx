import {
  Table,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { GET, POST, UPLOAD } from "../../functionHelper/APIFunction";
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
  const [isLoadingExport, setLoadingExport] = useState(false);
  const [pagination, setPagination] = useState({});
  const [isToggleImport, setToggleImport] = useState(false);
  const [exportSessionId, setExportSessionId] = useState("");
  const getIntent = (page, pageSize) => {
    if (page === undefined) page = 1;
    let body = {
      page: page,
      size: pageSize,
    };

    POST(BASE_URL + `api/intent/get_pagination`, JSON.stringify(body)).then(
      (res) => {
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
      }
    );
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

  const handleToggleImport = () => {
    setToggleImport((preState) => !preState);
  };
  const handleDownloadTmp = () => {
    GET(BASE_URL + "api/pattern/import/excel/get_template")
      .then((res) => {
        if (res.http_status === "OK") {
          window.location.replace(res.link);
        }
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error("Some things went wrong!!", "Error");
      });
  };
  const handleImportExcel = () => {
    console.log("import");
    var input = document.createElement("input");
    input.type = "file";

    input.onchange = (e) => {
      var file = e.target.files[0];
      console.log("this file", file);
      UPLOAD(BASE_URL + "api/pattern/import/excel", file)
        .then((res) => {
          if (res.http_status === "OK") {
            NotificationManager.success("Upload file successfully", "Success");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };
    input.click();
  };

  const handleExportExcel = () => {
    POST(BASE_URL + "api/pattern/export/excel", JSON.stringify({}))
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        setLoadingExport(true);
        setExportSessionId(res.session_id);
        handleCheckStatusExport(res.session_id);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error("Somethings went wrong!!!", "Error");
      });
  };
  const handleCheckStatusExport = (sessionId) => {
    let isRes = true;
    let checking = setInterval(() => {
      if (isRes) {
        GET(BASE_URL + "api/pattern/export/excel/status?sessionId=" + sessionId)
          .then((res) => {
            isRes = true;
            if (res.http_status === "OK" && res.status === "DONE") {
              NotificationManager.success("Export finished", "Success");
              getFileExcel(res.file_name);
              setLoadingExport(false);
              clearInterval(checking);
            }
            if (res.http_status === "OK" && res.status === "CRASHED") {
              setLoadingExport(false);
              clearInterval(checking);
            }
            if (res.http_status === "EXPECTATION_FAILED") {
              clearInterval(checking);
              throw res;
            }
          })
          .catch((err) => {
            setLoadingExport(false);
            NotificationManager.error("Some things when  wrong!", "error");
            console.log(err);
          });
        isRes = false;
      }
    }, 3000);
  };
  const getFileExcel = (fileName) => {
    GET(BASE_URL + "api/pattern/export/excel/get_file/" + fileName)
      .then((res) => {
        if (res.http_status !== "OK") throw res;
        const binaryString = window.atob(res.base64);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        // Create download link and click it
        const blob = new Blob([arrayBuffer], {
          type: "application/vnd.ms-excel",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error("Somethings went wrong!!!", "Error");
      });
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
        <div className="d-flex">
          <Dropdown isOpen={isToggleImport} toggle={handleToggleImport}>
            <DropdownToggle className="btn-table" id="btn-import">
              {isLoadingExport ? (
                <Spinner className="loadding" />
              ) : (
                <>
                  <i
                    className="fa-solid fa-cloud-arrow-up"
                    style={{ marginRight: "4px" }}
                  ></i>
                  Import file Excel
                </>
              )}
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-import-excel">
              <DropdownItem onClick={() => handleDownloadTmp()}>
                <i className="fa-solid fa-cloud-arrow-down icon-import"></i>
                Download template
              </DropdownItem>
              <DropdownItem onClick={handleImportExcel}>
                <i className="fa-solid fa-file-import icon-import"></i>
                Import file Excel
              </DropdownItem>
              <DropdownItem onClick={handleExportExcel}>
                <i className="fa-solid fa-download icon-import"></i>
                Export file Excel
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
