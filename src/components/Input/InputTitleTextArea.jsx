import { useEffect, useState } from "react";
import "./InputTitle.css";
function InputTitleTextArea({ title, placeHolder, readOnly, val, func }) {
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(val);
  }, [val]);
  const handleInputValue = (e) => {
    setValue(e.target.value);
    func(e.target.value);
  };
  return (
    <>
      <div className="input-area" style={{ margin: "0px" }}>
        <div className="inputTitle">{title}</div>
        <textarea
          style={{ scrollbarWidth: "none" }}
          type="search"
          className="input inputArea"
          placeholder={placeHolder}
          readOnly={readOnly}
          onChange={(e) => handleInputValue(e)}
          value={value}
        />
      </div>
    </>
  );
}
export default InputTitleTextArea;
