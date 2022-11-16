import { useState, Fragment } from "react";
import { Handle, Position } from "reactflow";
import ConditionMapping from "./ConditionMapping";

function NodeLayout({ data }) {
  const [nodeName, setNodeName] = useState(data.value);
  return (
    <Fragment>
      <div
        className="shadow p-3 mb-5 bg-white rounded"
        style={{
          height: "200px",
          width: "200px",
          background: "white",
          borderRadius: "15px",
          padding: "5px",
        }}
      >
        {/* <button
          type="button"
          value={data.id}
          className="btn-close"
          aria-label="Close"
          style={{
            position: "absolute",
            top: "2px",
            left: "170px",
            width: "20px",
          }}
        ></button> */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "185px",
          }}
        >
          <i
            className="fa fa-trash"
            style={{ fontSize: "10px" }}
            aria-hidden="true"
            onClick={() => data.delete(data.id)}
          ></i>
        </div>
        <Handle
          id="0"
          type="target"
          position={Position.Left}
          style={{
            top: "20px",
            width: "8px",
            height: "8px",
            border: "1.5px solid black",
            background: "none",
          }}
        />
        <div>
          <div className="node-name">
            <label>Enter text:</label>
            <input
              className="form-control form-control-sm border-0"
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              style={{ background: "#F2F3F4" }}
            ></input>
          </div>
          <div className="condition-mapping">
            <div className="condition-intent">
              <label style={{ fontSize: "10px" }}>Customer's response</label>
              <ConditionMapping background="#f4f4f6" readOnly={false} />
              <Handle
                id="1"
                type="source"
                position={Position.Right}
                style={{
                  top: "113px",
                  width: "8px",
                  height: "8px",
                  border: "1.5px solid black",
                  background: "none",
                }}
              />
            </div>
            <div className="condition-incorrect">
              <ConditionMapping
                background="#FEF9E7"
                color="#E67E22"
                value="Customer response incorrectly"
                readOnly={true}
              />
              <Handle
                id="2"
                type="source"
                position={Position.Right}
                style={{
                  top: "141px",
                  width: "8px",
                  height: "8px",
                  border: "1.5px solid #E67E22",
                  background: "none",
                }}
              />
            </div>
            <div className="condition-no-response">
              <ConditionMapping
                background="#FDEDEC"
                color="#E74C3C"
                value="Customer does not response"
                readOnly={true}
              />
              <Handle
                id=""
                type="source"
                position={Position.Right}
                style={{
                  top: "172px",
                  width: "8px",
                  height: "8px",
                  border: "1.5px solid #E74C3C",
                  background: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default NodeLayout;
