import { Fragment, memo, useState } from "react";
import { Handle, Position } from "reactflow";
import ConditionMapping from "./ConditionMapping";
import { Button } from "reactstrap";
import "../../styles/Node.css";
const textSize = {
  fontSize: "15px",
};
function NodeLayout({ data }) {
  console.log("data", data);
  const [conditions, setConditions] = useState(data.conditionMapping);
  console.log("condi", conditions);
  const handleAddCondition = () => {
    conditions.push({ id: "123" });
    setConditions(conditions);
    console.log("condi after", conditions);
  };

  return (
    <Fragment>
      {console.log("t")}
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
              readOnly={true}
              value={data.value}
              onClick={() => {
                data.openModal();
              }}
            ></input>
          </div>

          <div className="condition-mapping" style={{ alignItems: "center" }}>
            <label style={textSize}>Customer's response</label>
            {conditions.map((item) => {
              console.log("re");
              return (
                <div className="condition-intent" key={item.id}>
                  <ConditionMapping
                    background="#f4f4f6"
                    color="#060504"
                    data={{
                      intents: data.intents,
                      conditionMapping: item,
                    }}
                  />
                </div>
              );
            })}

            {/* <div className="condition-incorrect">
              <ConditionMapping
                background="#FEF9E7"
                color="#fea220"
                value="Customer response incorrectly"
                readOnly={true}
              />
            </div>
            <div className="condition-no-response">
              <ConditionMapping
                background="#FDEDEC"
                color="#E74C3C"
                value="Customer does not response"
                readOnly={true}
              />
            </div> */}
          </div>
          <Button
            outline
            color="success"
            style={{ border: "dashed" }}
            onClick={handleAddCondition}
          >
            Add intent
          </Button>
          <div></div>
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
            {/* <Handle
              id="2"
              type="source"
              position={Position.Right}
              style={{
                top: "138px",
                width: "10px",
                height: "10px",
                border: "2px  solid #E67E22",
                background: "none",
              }}
            />
            <Handle
              id=""
              type="source"
              position={Position.Right}
              style={{
                top: "168px",
                width: "10px",
                height: "10px",
                border: "2px solid #E74C3C",
                background: "none",
              }}
            /> */}
          </>
        </div>
      </div>
    </Fragment>
  );
}

export default memo(NodeLayout);
