import {
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  DropdownToggle,
} from "reactstrap";
import { useState } from "react";
import { Handle, Position } from "reactflow";
function ConditionMapping({ background, color, border, data }) {
  const [dropdownOpen, setOpen] = useState(false);

  const [value, setValue] = useState({
    id: data.conditionMapping.intent_id,
    name:
      data.conditionMapping.intent_id === null
        ? "Choose intent"
        : data.intents.filter(
            (items) => items.id === data.conditionMapping.intent_id
          ).length === 0
        ? "Choose intent"
        : data.intents.filter(
            (items) => items.id === data.conditionMapping.intent_id
          )[0].name,
  });
  const getIntentName = (id) => {
    return data.intents.filter((intent) => intent.id === id).length !== 0
      ? data.intents.filter((intent) => intent.id === id)[0].name
      : "Choose intent";
  };
  return (
    <div style={{ margin: "5px 0px" }}>
      <ButtonDropdown
        // toggle={() => {
        //   setOpen(!dropdownOpen);
        // }}
        // isOpen={dropdownOpen}
        style={{ width: "100%" }}
      >
        <DropdownToggle
          id="intent"
          style={{
            width: "100%",
            height: "40px",
            background,
            color,
            fontSize: "15px",
            fontWeight: "600",
            borderRadius: "8px",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          value={data.conditionMapping.intent_id}
        >
          {getIntentName(data.conditionMapping.intent_id)}
        </DropdownToggle>
        <DropdownMenu
          style={{ maxHeight: "400px", overflowY: "scroll", cursor: "pointer" }}
        >
          <DropdownItem header>Choose Intent</DropdownItem>
          {data.intents.map((item) => {
            return (
              <DropdownItem
                onClick={() => {
                  setValue({ id: item.id, name: item.name });
                  data.setCondition({
                    conditionId: data.conditionMapping.id,
                    intentId: item.id,
                    intentName: item.name,
                  });
                }}
                key={item.id}
                value={item.id}
              >
                {item.name}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
      <Handle
        id={data.conditionMapping.id}
        type="source"
        position={Position.Right}
        onConnect={(param) => {
          console.log("checking connected");
          data.setCondition(param);
          console.log("param in onconnect", param);
        }}
        style={{
          top: "-17px",
          left: "275px",
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
