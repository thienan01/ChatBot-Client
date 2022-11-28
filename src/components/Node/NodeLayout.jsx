import { Fragment, memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import ConditionMapping from "./ConditionMapping";
import Keyword from "./Keyword";
import { Button } from "reactstrap";
import uniqueID from "../../functionHelper/GenerateID";
import "../../styles/Node.css";
const textSize = {
  fontSize: "15px",
};
function NodeLayout({ data }) {
  console.log("check condi", data.conditionMapping);
  const [conditions, setConditions] = useState(data.conditionMapping);
  const [value, setValue] = useState(data.value);
  useEffect(() => {
    data.value = value;
  }, [value, data]);
  useEffect(() => {
    data.conditionMapping = conditions;
    console.log("after", data.conditionMapping);
  }, [conditions, data]);

  const setConditionMapping = (data) => {
    console.log("dd", data);
    console.log("cc", conditions);
    setConditions(
      conditions.map((cnd) => {
        if (cnd.id === data.conditionId) {
          cnd.intent_id = data.intentId;
          return cnd;
        } else {
          if (cnd.id === data.sourceHandle) {
            cnd.source = data.source;
            cnd.sourceHandle = data.sourceHandle;
            cnd.target = data.target;
          }
          return cnd;
        }
      })
    );
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
            <div className="intent">
              {conditions.map((item) => {
                if (item.predict_type === "INTENT") {
                  return (
                    <div className="condition-intent" key={item.id}>
                      <ConditionMapping
                        background="#f4f4f6"
                        color="#060504"
                        data={{
                          intents: data.intents,
                          conditionMapping: item,
                          setCondition: setConditionMapping,
                        }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="condition-intent" key={item.id}>
                      <Keyword
                        background="#f4f4f6"
                        color="#060504"
                        data={{
                          intents: data.intents,
                          conditionMapping: item,
                          setCondition: setConditionMapping,
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div className="keyword"></div>
          </div>
          <div className="addCondition">
            <Button
              onClick={() => {
                setConditions([
                  ...conditions,
                  { id: uniqueID(), intent_id: null },
                ]);
              }}
            >
              + intent
            </Button>
            <Button>+ key work</Button>
          </div>
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
