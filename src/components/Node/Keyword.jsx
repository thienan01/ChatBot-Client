import React from "react";
import { Handle, Position } from "reactflow";
import { useState } from "react";

function Keyword({ color, background, border, data }) {
  const [key, setKey] = useState(data.conditionMapping.keyword);
  return (
    <>
      <div
        className="inputKeyword"
        style={{
          margin: "5px 0px",
          width: "100%",
          height: "40px",
          background,
          color,
          borderRadius: "12px",
        }}
      >
        <input
          id="keyword"
          className="form-control form-control-sm"
          style={{
            width: "89%",
            height: "40px",
            background: "none",
            color,
            fontSize: "15px",
            fontWeight: "600",
            textAlign: "left",
            display: "inline",
            border: "none",
          }}
          placeholder="Keyword"
          type="text"
          value={data.conditionMapping.keyword}
          readOnly
          // onChange={(e) => {
          //   setKey(e.target.value);
          //   data.setCondition({
          //     conditionId: data.conditionMapping.id,
          //     keyword: e.target.value,
          //   });
          // }}
        />
        <i
          className="fa-solid fa-delete-left deleteCondition"
          style={{ textAlign: "right" }}
          onClick={() => data.deleteCondition(data.conditionMapping.id)}
        ></i>
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
