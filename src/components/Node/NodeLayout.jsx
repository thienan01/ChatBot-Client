import { Fragment, memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import ConditionMapping from "./ConditionMapping";
import Keyword from "./Keyword";
import uniqueID from "../../functionHelper/GenerateID";
import EditNodeModal from "../Modal/EditNodeModal";
import "../../styles/Node.css";
const textSize = {
  fontSize: "16px",
};

function NodeLayout({ data }) {
  const [conditions, setConditions] = useState(data.conditionMapping);
  const [value, setValue] = useState(data.value);
  const [openEditNode, setOpenEditNode] = useState(false);
  const [intentList, setIntentList] = useState(data.intents);
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
  const deleteCondition = (id) => {
    setConditions(conditions.filter((item) => item.id !== id));
  };
  const handleOpenEditNodeModal = () => {
    setConditions((conditions) =>
      conditions.map((cnd) => {
        return cnd;
      })
    );
    setOpenEditNode(!openEditNode);
  };

  const handleEditNodeByModal = (message) => {
    setValue(message);
  };
  const addKeyword = () => {
    setConditions([
      ...conditions,
      { id: uniqueID(), predict_type: "KEYWORD", keyword: "" },
    ]);
  };
  const addIntent = () => {
    setConditions([
      ...conditions,
      { id: uniqueID(), intent_id: null, predict_type: "INTENT" },
    ]);
  };
  const reloadIntents = (intentLst) => {
    setIntentList(intentLst);
  };
  useEffect(() => {
    if (document.querySelector(".condition-items-section")) {
      setTimeout(() => {
        document.querySelector(".condition-items-section").scrollTop =
          document.querySelector(".condition-items-section").scrollHeight;
      }, 100);
    }
  }, [conditions]);
  return (
    <Fragment>
      <div
        id="node"
        className="bg-white"
        style={{
          width: "min-content",
          background: "white",
          borderRadius: "15px",
          padding: "18px",
          minWidth: "300px",
        }}
        onClick={handleOpenEditNodeModal}
      >
        <div className="hoverSession"></div>
        <div
          id="deleteIcon"
          className="shadow bg-white"
          onClick={() => data.delete(data.id)}
        >
          <i
            className="fa fa-trash"
            style={{ fontSize: "16px", margin: "10px", color: "red" }}
            aria-hidden="true"
          ></i>
        </div>
        <div>
          <div className="node-name">
            <div style={{ margin: "0px 0px 10px 0px" }}>
              <div className="textIcon">
                <i className="fa-solid fa-newspaper text-white"></i>
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
            <div id="message">{value}</div>
          </div>
          <div
            className="condition-mapping"
            style={{
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div className="replyIcon">
              <i className="fa-solid fa-shuffle text-white"></i>
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
            <div className="intent" style={{ marginTop: "10px" }}>
              {conditions.map((item, idx) => {
                if (
                  item.predict_type === "INTENT" ||
                  item.predict_type === undefined
                ) {
                  return (
                    <div
                      className="condition-intent"
                      style={{ height: "65px" }}
                      key={++idx}
                    >
                      <ConditionMapping
                        data={{
                          intents: intentList,
                          conditionMapping: item,
                          setCondition: setConditionMappingIntent,
                          deleteCondition: deleteCondition,
                        }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="condition-intent"
                      key={item.id}
                      style={{ height: "65px" }}
                    >
                      <Keyword
                        data={{
                          conditionMapping: item,
                          setCondition: setConditionMappingKeyword,
                          deleteCondition: deleteCondition,
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div className="keyword"></div>
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
      <EditNodeModal
        open={openEditNode}
        toggle={handleOpenEditNodeModal}
        nodeData={{
          message: value,
          conditions: conditions,
          intents: intentList,
          entityType: data.entityType,
          handleSetMessage: handleEditNodeByModal,
          setKeyword: setConditionMappingKeyword,
          addKeyword: addKeyword,
          deleteCondition: deleteCondition,
          addIntent: addIntent,
          setIntent: setConditionMappingIntent,
          reloadIntents: reloadIntents,
        }}
      />
    </Fragment>
  );
}

export default memo(NodeLayout);
