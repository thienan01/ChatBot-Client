import {
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  DropdownToggle,
} from "reactstrap";
import { useState } from "react";
import { Handle, Position } from "reactflow";
function ConditionMapping({ background, color, data }) {
  const [dropdownOpen, setOpen] = useState(false);
  const [value, setValue] = useState({
    id: data.conditionMapping.intent_id,
    name:
      data.conditionMapping.intent_id === null
        ? "Choose intent"
        : data.intents.filter(
            (items) => items.id === data.conditionMapping.intent_id
          )[0].name,
  });
  return (
    <div style={{ margin: "5px 0px" }}>
      <ButtonDropdown
        toggle={() => {
          setOpen(!dropdownOpen);
        }}
        isOpen={dropdownOpen}
      >
        <DropdownToggle
          caret
          style={{
            height: "25px",
            background,
            color,
            fontSize: "13px",
            fontWeight: "500",
            borderRadius: "10px",
          }}
          value={value.id}
        >
          {value.name}
        </DropdownToggle>
        <DropdownMenu>
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
          data.setCondition(param);
        }}
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
    </div>
  );
}
export default ConditionMapping;
