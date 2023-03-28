import { useState } from "react";
import filterIcon from "../../assets/filter.png";
import clearFilter from "../../assets/clear-filter.png";
import "./Filter.css";
import FilterModal from "../Modal/FilterModal";
function Filter() {
  const [filterItems, setFilterItems] = useState([{ name: "Created date" }]);
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const handleToggleFilterModal = () => {
    setOpenFilterModal(!openFilterModal);
  };
  const getFilterValue = (value) => {
    console.log(value);
  };
  return (
    <>
      <div className="filter-section">
        <div className="filter-section">
          <div className="filterIcon">
            <img src={filterIcon} alt="" style={{ width: "15px" }} />
          </div>
          <div className="dateTime-picker" onClick={handleToggleFilterModal}>
            {/* <span>Date created</span> */}
            {filterItems.map((item, idx) => {
              return <span key={idx}>{item.name}</span>;
            })}
            <i class="fa-solid fa-caret-down" style={{ marginLeft: "5px" }}></i>
          </div>
        </div>
        <img src={clearFilter} style={{ width: "18px", display: "end" }} />
      </div>
      <FilterModal open={openFilterModal} toggle={handleToggleFilterModal} />
    </>
  );
}
export default Filter;
