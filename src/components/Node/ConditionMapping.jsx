import { Handle, Position } from "reactflow";
import "./css/conditionMapping.css";
function ConditionMapping({ data }) {
  const getIntentName = (id) => {
    return data.intents.filter((intent) => intent.id === id).length !== 0
      ? data.intents.filter((intent) => intent.id === id)[0].name
      : "Choose intent";
  };
  return (
    <div className="condition-container">
      <div id="intent" value={data.conditionMapping.intent_id}>
        <div className="condition-title">
          <i className="fa-solid fa-arrows-split-up-and-left"></i> Topic/Intent
        </div>
        <div>{getIntentName(data.conditionMapping.intent_id)}</div>
      </div>
      <Handle
        id={data.conditionMapping.id}
        type="source"
        position={Position.Right}
        onConnect={(param) => {
          data.setCondition(param);
        }}
        style={{
          top: "-30px",
          // left: "275px",
          right: "-102%",
          width: "15px",
          height: "15px",
          border: "3px solid #F39C12",
          background: "none",
          position: "relative",
        }}
      />
    </div>
  );
}
export default ConditionMapping;
