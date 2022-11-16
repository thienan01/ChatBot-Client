import { useCallback } from "react";
import { Handle, Position } from "reactflow";

function ConditionNoResponse({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>
        <input
          className="form-control"
          type="text"
          style={{ height: "30px", width: "200px" }}
        ></input>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

export default ConditionNoResponse;
