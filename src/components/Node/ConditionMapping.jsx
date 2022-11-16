function ConditionMapping({ background, color, value, readOnly }) {
  return (
    <>
      <input
        className="form-control border-0"
        type="text"
        style={{
          height: "25px",
          marginTop: "5px",
          background,
          color,
          fontSize: "10px",
        }}
        value={value}
        readOnly={readOnly}
      ></input>
    </>
  );
}
export default ConditionMapping;
