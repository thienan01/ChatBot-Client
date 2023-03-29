import "./SearchBar.css";
function SearchBar({ func }) {
  const handleKey = (e) => {
    if (e.key === "Enter") {
      func({ val: e.target.value });
    }
  };
  const handleClearInput = (e) => {
    if (e.target.value === "") {
      func("");
    }
  };
  return (
    <>
      <div className="searchArea" id="searchArea" style={{ width: "300px" }}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          type="search"
          className="searchInput searchInputTable"
          placeholder="Find your records..."
          onKeyDown={(e) => handleKey(e)}
          onChange={(e) => handleClearInput(e)}
        />
      </div>
    </>
  );
}
export default SearchBar;
