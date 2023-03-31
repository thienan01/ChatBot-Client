import { Spin } from "antd";
import { useEffect, useState } from "react";
import "./loading.css";
function LoadingAnt({ display }) {
  const [isShow, setIsShow] = useState("none");
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
    </>
  );
}
export default LoadingAnt;
