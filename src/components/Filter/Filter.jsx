import { useState } from "react";
import filterIcon from "../../assets/filter.png";
import clearFilter from "../../assets/clear-filter.png";
import "./Filter.css";
import FilterModal from "../Modal/FilterModal";
function Filter({ func }) {
  const [filterItems, setFilterItems] = useState([{ name: "Created date" }]);
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const handleToggleFilterModal = (value) => {
    setOpenFilterModal(!openFilterModal);
    if (value.fromDate && value.toDate) {
      setFilterItems([
        {
          name:
            value.fromDate.replaceAll("-", "/") +
            " - " +
            value.toDate.replaceAll("-", "/"),
        },
      ]);
      func({ date: value });
    }
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
        <div
          className="filterIcon clearFilter"
          onClick={() => {
            setFilterItems([{ name: "Created date" }]);
            func({ date: undefined });
          }}
        >
          <img src={clearFilter} style={{ width: "18px", display: "end" }} />
        </div>
      </div>
      <FilterModal open={openFilterModal} toggle={handleToggleFilterModal} />
    </>
  );
}
export default Filter;
