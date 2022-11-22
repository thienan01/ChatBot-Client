import {
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  DropdownToggle,
} from "reactstrap";
import { useState } from "react";
import { Handle, Position } from "reactflow";

function ConditionMapping({ background, color, data }) {
  console.log("condition", data);
  // return (
  //   <>
  //     <div style={{ margin: "5px 0px" }}>
  //       {/* <input
  //         className="form-control border-0"
  //         type="text"
  //         style={{
  //           height: "25px",
  //           background,
  //           color,
  //           fontSize: "13px",
  //           fontWeight: "500",
  //           borderRadius: "10px",
  //         }}
  //         value={value}
  //         readOnly={readOnly}
  //       ></input> */}
  //       <Dropdown
  //         style={{
  //           height: "25px",
  //           background,
  //           color,
  //           fontSize: "13px",
  //           fontWeight: "500",
  //           borderRadius: "10px",
  //         }}
  //         isOpen={true}
  //       >
  //         <DropdownToggle>s</DropdownToggle>
  //         <DropdownMenu>
  //           <DropdownItem>test</DropdownItem>
  //         </DropdownMenu>
  //       </Dropdown>
  //     </div>
  //   </>
  // );

  const [dropdownOpen, setOpen] = useState(false);
  const [value, setValue] = useState({
    id: data.conditionMapping.intent_id,
    name: "de",
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
        id="1"
        type="source"
        position={Position.Right}
        style={{
          top: "108px",
          width: "10px",
          height: "10px",
          border: "2px solid black",
          background: "none",
        }}
      />
    </div>
  );
}
export default ConditionMapping;
