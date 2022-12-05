import { Handle, Position } from "reactflow";
import { useState, useEffect } from "react";
function StartNode({ data }) {
  const setConditionMapping = (param) => {
    data.conditionMapping[0].source = param.source;
    data.conditionMapping[0].sourceHandle = param.sourceHandle;
    data.conditionMapping[0].target = param.target;
  };
  return (
    <>
      <div
        id="node"
        className="shadow bg-white"
        style={{
          width: "112px",
          background: "white",
          borderRadius: "15px",
          padding: "11px",
          fontSize: "18px",
        }}
      >
        <i
          class="fa-solid fa-circle-play"
          style={{ fontSize: "18px", marginRight: "10px" }}
        ></i>
        Start
      </div>
      <Handle
        id="start"
        type="source"
        position={Position.Right}
        onConnect={(param) => {
          console.log(param);
          setConditionMapping(param);
        }}
        style={{
          width: "15px",
          height: "15px",
          border: "3px solid #F39C12",
          background: "none",
        }}
      />
    </>
  );
}
export default StartNode;
