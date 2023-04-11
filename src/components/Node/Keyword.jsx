import { Handle, Position } from "reactflow";
import "./css/conditionMapping.css";
function Keyword({ data }) {
  return (
    <>
      <div className="condition-container-keyword">
        <div id="keyword">
          <div className="condition-title">
            <i class="fa-solid fa-pen-to-square"></i> Keyword
          </div>
          <div />
          {data.conditionMapping.keyword}
        </div>
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
