import { Fragment, memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import ConditionMapping from "./ConditionMapping";
import { Button } from "reactstrap";
import uniqueID from "../../functionHelper/GenerateID";
import "../../styles/Node.css";
const textSize = {
  fontSize: "15px",
};
function NodeLayout({ data }) {
  const [conditions, setConditions] = useState(data.conditionMapping);
  const [value, setValue] = useState(data.value);
  data.value = value;
  useEffect(() => {
    data.conditionMapping = [{ id: "", intent_id: "" }];
  }, []);
  const setCondition = ({ src, handle, target }) => {
    console.log("s", src);
    console.log("ha", handle);
    console.log("t", target);
    data.conditionMapping = [
      {
        id: "",
        intent_id: src,
        source: handle,
        target: target,
      },
    ];
  };

  return (
    <Fragment>
      <div
        className="shadow bg-white rounded"
        style={{
          width: "250px",
          background: "white",
          borderRadius: "15px",
          padding: "12px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "227px",
          }}
        >
          <i
            className="fa fa-trash"
            style={{ fontSize: "13px" }}
            aria-hidden="true"
            onClick={() => data.delete(data.id)}
          ></i>
        </div>

        <div>
          <div className="node-name">
            <label style={textSize}>Enter text:</label>
            <input
              className="form-control form-control-sm border-0"
              type="text"
              style={{ background: "#F2F3F4" }}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            ></input>
          </div>

          <div className="condition-mapping" style={{ alignItems: "center" }}>
            <label style={textSize}>Customer's response</label>
            {conditions.map((item) => {
              return (
                <div className="condition-intent" key={item.id}>
                  <ConditionMapping
                    background="#f4f4f6"
                    color="#060504"
                    data={{
                      intents: data.intents,
                      conditionMapping: item,
                    }}
                    setCondition={setCondition}
                  />
                </div>
              );
            })}
          </div>
          <Button
            onClick={() => {
              setConditions([
                ...conditions,
                { id: uniqueID().toString(), intent_id: null },
              ]);
            }}
          >
            +
          </Button>
          <>
            <Handle
              id="0"
              type="target"
              position={Position.Left}
              style={{
                top: "50px",
                width: "10px",
                height: "10px",
                border: "2px solid black",
                background: "none",
              }}
            />
          </>
        </div>
      </div>
    </Fragment>
  );
}

export default memo(NodeLayout);
