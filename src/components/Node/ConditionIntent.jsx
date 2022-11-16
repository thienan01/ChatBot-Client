import { Handle, Position } from "reactflow";

function ConditionIntent({ data }) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>
        <input className="form-control form-control-sm" type="text"></input>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

export default ConditionIntent;
