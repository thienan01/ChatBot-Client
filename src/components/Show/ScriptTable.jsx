import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GET, POST } from "../../functionHelper/APIFunction";
import { BASE_URL } from "../../global/globalVar";
import { NotificationManager } from "react-notifications";
import { ScriptContext } from "../Context/ScriptContext";
import ModalUpdateScript from "./ModalUpdateScript";
import ModalShowCode from "./ModalShowCode";

function ScriptTable() {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [pagination, setPagination] = useState({});
  const [openModalCode, setOpenModalCode] = useState(false);
  const [currentID, setCurrentID] = useState("");
  const navigate = useNavigate();
  const [scripts, setScripts] = useState([]);
  let context = useContext(ScriptContext);
  const loadScript = (page) => {
    if (page === undefined) page = 1;
    GET(
      BASE_URL + "api/script/get_pagination/by_user_id?page=" + page + "&size=5"
    )
      .then((res) => {
        setPagination({
          totalPage: res.total_pages,
          totalItems: res.total_items,
        });
        setScripts(res.items);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadScript();
  }, []);

  const handleToggleModal = () => {
    setOpenModalUpdate(!openModalUpdate);
  };
  const handleToggleCode = () => {
    setOpenModalCode(!openModalCode);
  };
  const handleDelete = (id) => {
    let body = {
      id: id,
    };
    POST(BASE_URL + "api/script/delete", JSON.stringify(body))
      .then((res) => {
        if (res.http_status === "OK") {
          NotificationManager.success("Delete successfully", "success");
          loadScript();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          handleToggleModal();
        }}
      >
        <i className="fa-solid fa-plus" style={{ marginRight: "4px" }}></i>
        Create new
      </Button>
      <Table striped bordered hover className="tableData">
        <thead>
          <tr>
            <th>Script name</th>
            <th style={{ width: "15%" }} className="text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {scripts.map((script) => {
            return (
              <tr key={script.id}>
                <td
                  onClick={() => {
                    context.setValue({ id: script.id, name: script.name });
                    navigate("/train");
                  }}
                >
                  {script.name}
                </td>
                <td className="text-center">
                  <div
                    className="actionTable"
                    style={{ background: "#28B463" }}
                    onClick={() => {}}
                  >
                    <i className="fa-solid fa-pen-to-square text-white"></i>
                  </div>
                  <div
                    className="actionTable"
                    onClick={() => {
                      handleDelete(script.id);
                    }}
                  >
                    <i className="fa-regular fa-trash-can text-white"></i>
                  </div>
                  <div
                    className="actionTable"
                    onClick={() => {
                      setCurrentID(script.id);
                      handleToggleCode();
                    }}
                    style={{ background: "#F1C40F" }}
                  >
                    <i className="fa-solid fa-eye actionIntent text-white"></i>
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
                loadScript(i + 1);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
      <ModalUpdateScript open={openModalUpdate} toggle={handleToggleModal} />
      <ModalShowCode
        open={openModalCode}
        toggle={handleToggleCode}
        scriptID={currentID}
      />
    </>
  );
}

export default ScriptTable;
