import { useEffect, useState } from "react";
import "./InputTitle.css";
function InputTitle({ title, placeHolder, readOnly, val, func }) {
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
      <div className="input-area">
        <div className="inputTitle">{title}</div>
        <input
          type="search"
          className="input"
          placeholder={placeHolder}
          readOnly={readOnly}
          onChange={(e) => handleInputValue(e)}
          value={value}
        />
      </div>
    </>
  );
}
export default InputTitle;
