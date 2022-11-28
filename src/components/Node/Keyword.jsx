import React from "react";
import { Handle, Position } from "reactflow";

function Keyword(background, color, data) {
  return (
    <>
      <div className="inputKeyword">
        <input
          className="form-control form-control-sm border-0"
          type="text"
          style={{ background: "#F2F3F4" }}
        />
      </div>
      <Handle
        id="sds"
        type="source"
        position={Position.Right}
        onConnect={(param) => {}}
        style={{
          top: "-12px",
          left: "233px",
          width: "10px",
          height: "10px",
          border: "2px solid black",
          background: "none",
          position: "relative",
        }}
      />
    </>
  );
}

export default Keyword;
