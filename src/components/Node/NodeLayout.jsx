import { Fragment, memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import ConditionMapping from "./ConditionMapping";
import Keyword from "./Keyword";
import { Button } from "reactstrap";
import uniqueID from "../../functionHelper/GenerateID";
import "../../styles/Node.css";
const textSize = {
  fontSize: "16px",
};
function NodeLayout({ data }) {
  const [conditions, setConditions] = useState(data.conditionMapping);
  const [value, setValue] = useState(data.value);
  useEffect(() => {
    data.value = value;
  }, [value, data]);
  useEffect(() => {
    data.conditionMapping = conditions;
  }, [conditions, data]);

  const setConditionMappingIntent = (data) => {
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
  const setConditionMappingKeyword = (data) => {
    setConditions(
      conditions.map((cnd) => {
        if (cnd.id === data.conditionId) {
          cnd.keyword = data.keyword;
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
        id="node"
        className="shadow bg-white"
        style={{
          width: "300px",
          background: "white",
          borderRadius: "15px",
          padding: "18px",
        }}
      >
        <div className="hoverSession"></div>
        <div id="deleteIcon" className="shadow bg-white">
          <i
            className="fa fa-trash"
            style={{ fontSize: "16px", margin: "10px", color: "red" }}
            aria-hidden="true"
            onClick={() => data.delete(data.id)}
          ></i>
        </div>
        <div>
          <div className="node-name">
            <div style={{ margin: "0px 0px 10px 0px" }}>
              <div className="textIcon">
                <i className="fa-solid fa-font text-white"></i>
              </div>
              <label
                style={{
                  ...textSize,
                  fontWeight: "600",
                  position: "absolute",
                  top: "15px",
                }}
              >
                Your message
              </label>
            </div>
            <input
              id="message"
              className="form-control form-control-sm "
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            ></input>
          </div>
          <div
            className="condition-mapping"
            style={{ alignItems: "center", marginTop: "20px" }}
          >
            <div className="replyIcon">
              <i className="fa-solid fa-reply text-white"></i>
            </div>
            <label
              style={{
                ...textSize,
                fontWeight: "600",
                position: "absolute",
                top: "114 px",
              }}
            >
              Customer's response
            </label>
            <div className="intent">
              {conditions.map((item) => {
                if (
                  item.predict_type === "INTENT" ||
                  item.predict_type === undefined
                ) {
                  return (
                    <div
                      className="condition-intent"
                      key={item.id}
                      style={{ height: "48px" }}
                    >
                      <ConditionMapping
                        background="#fffaf4"
                        color="#F39C12"
                        border="0.5px solid #FCF3CF "
                        data={{
                          intents: data.intents,
                          conditionMapping: item,
                          setCondition: setConditionMappingIntent,
                        }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="condition-intent"
                      key={item.id}
                      style={{ height: "48px" }}
                    >
                      <Keyword
                        id="keyword"
                        background="#FDEDEC  "
                        color=" #E74C3C"
                        border="0.2px solid #FADBD8"
                        data={{
                          conditionMapping: item,
                          setCondition: setConditionMappingKeyword,
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div className="keyword"></div>
          </div>
          <div id="addCondition" className="addCondition">
            <Button
              color="primary"
              style={{ width: "48%", border: "none" }}
              onClick={() => {
                setConditions([
                  ...conditions,
                  { id: uniqueID(), intent_id: null, predict_type: "INTENT" },
                ]);
              }}
            >
              <i className="fa-solid fa-plus"></i> Intent
            </Button>
            <Button
              color="primary"
              style={{ width: "48%", border: "none" }}
              onClick={() => {
                setConditions([
                  ...conditions,
                  { id: uniqueID(), predict_type: "KEYWORD", keyword: "" },
                ]);
              }}
            >
              <i className="fa-solid fa-plus"></i> Keyword
            </Button>
          </div>
          <>
            <Handle
              id="0"
              type="target"
              position={Position.Left}
              style={{
                top: "65px",
                left: "-9px",
                width: "15px",
                height: "15px",
                border: "3px solid black",
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
