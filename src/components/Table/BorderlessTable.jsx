import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useEffect, useState, useContext } from "react";
import { ScriptContext } from "../Context/ScriptContext";
import { useNavigate } from "react-router-dom";
import "./BorderlessTable.css";

function BorderlessTable({ data, action }) {
  let [scripts, setScripts] = useState({ data });
  let context = useContext(ScriptContext);
  const navigate = useNavigate();
  return (
    <>
      <Table borderless hover responsive className="tableData">
        <thead style={{ background: "#f6f9fc" }}>
          <tr style={{ width: "10%" }}>
            <th>#</th>
            <th>
              <span className="vertical" />
              Script name
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
          {scripts.scripts.map((script, index) => {
            return (
              <tr key={script.id}>
                <td>{++index}</td>
                <td
                  onClick={() => {
                    context.setValue({ id: script.id, name: script.name });
                    navigate("/train");
                  }}
                >
                  {script.name}
                </td>
                <td>14:00AM 16/2/2022</td>
                <td className="d-flex action-row">
                  <div onClick={() => {}}>
                    <i className="fa-solid fa-pen-to-square text-primary"></i>
                  </div>
                  <div
                    onClick={() => {
                      // setCurrentID(script.id);
                      // handleToggleCode();
                    }}
                  >
                    <i
                      className="fa-regular fa-eye actionIntent "
                      style={{ color: "#56cc6e" }}
                    ></i>
                  </div>
                  <div
                    onClick={() => {
                      // action(script.id);
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
      {/* <Pagination aria-label="Page navigation example">
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
      </Pagination> */}
    </>
  );
}
export default BorderlessTable;
