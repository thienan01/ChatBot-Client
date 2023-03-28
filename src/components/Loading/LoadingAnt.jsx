import { Spin } from "antd";
import { useEffect, useState } from "react";
import "./loading.css";
function LoadingAnt({ display }) {
  const [isShow, setIsShow] = useState("none");
  console.log("show", display);
  useEffect(() => {
    if (display) {
      setIsShow("block");
    } else {
      setIsShow("none");
    }
  }, [display]);
  return (
    <>
      <Spin style={{ display: isShow }} className="spinner" size="large" />
      {console.log(isShow)}
    </>
  );
}
export default LoadingAnt;
