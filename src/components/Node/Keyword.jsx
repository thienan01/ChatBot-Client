import React from "react";
import { Handle, Position } from "reactflow";
import { useState } from "react";

function Keyword({ color, background, border, data }) {
  const [key, setKey] = useState(data.conditionMapping.keyword);
  return (
    <>
      <div className="inputKeyword" style={{ margin: "5px 0px" }}>
        <input
          id="keyword"
          className="form-control form-control-sm"
          style={{
            width: "100%",
            height: "40px",
            background,
            color,
            fontSize: "15px",
            fontWeight: "600",
            borderRadius: "12px",
            textAlign: "left",
          }}
          placeholder="Keyword"
          type="text"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            data.setCondition({
              conditionId: data.conditionMapping.id,
              keyword: e.target.value,
            });
          }}
        />
      </div>
      <Handle
        id={data.conditionMapping.id}
        type="source"
        position={Position.Right}
        onConnect={(param) => {
          data.setCondition(param);
        }}
        style={{
          top: "-17px",
          left: "275px",
          width: "15px",
          height: "15px",
          border: "3px solid #E74C3C ",
          background: "none",
          position: "relative",
        }}
      />
    </>
  );
}

export default Keyword;
