import { useState } from "react";
import filterIcon from "../../assets/filter.png";
import clearFilter from "../../assets/clear-filter.png";
import "./Filter.css";
import FilterModal from "../Modal/FilterModal";
import { getCookie, setCookie } from "../../functionHelper/GetSetCookie";
import FilterUerModal from "../Modal/FilterUerModal";

const InitFilter = () => {
  setCookie("filterUser", "", 0);
  var filterList = [
    { id: 1, name: "Created date", authorize: "ALL", type: "DateTime" },
    { id: 2, name: "Select user", authorize: "ADMIN", type: "Search" },
  ];
  return getCookie("role") === "ADMIN"
    ? filterList
    : filterList.filter((filter) => filter.authorize !== "ADMIN");
};

const CheckFilter = () => {
  var user = getCookie("filterUser");
  if (!user) {
    return InitFilter();
  }
  var filterList = [
    { name: "Created date", authorize: "ALL", type: "DateTime" },
    { name: JSON.parse(user).username, authorize: "ADMIN", type: "Search" },
  ];
  return getCookie("role") === "ADMIN"
    ? filterList
    : filterList.filter((filter) => filter.authorize !== "ADMIN");
};
function Filter({ func }) {
  const [filterItems, setFilterItems] = useState(CheckFilter());
  const [isOpenFilterDateModal, setOpenFilterDateModal] = useState(false);
  const [isOpenFilterSearchUserModal, setOpenFilterSearchUserModal] =
    useState(false);

  const handleToggleFilterModal = (value, type) => {
    if (type === "DateTime") {
      setOpenFilterDateModal(!isOpenFilterDateModal);
      if (value.fromDate && value.toDate) {
        let filterDate =
          value.fromDate.replaceAll("-", "/") +
          " - " +
          value.toDate.replaceAll("-", "/");
        setFilterItems(
          filterItems.map((filter) =>
            filter.type === "DateTime"
              ? { ...filter, name: filterDate }
              : filter
          )
        );
        func({ date: value });
      }
    }
    if (type === "Search") {
      setOpenFilterSearchUserModal(!isOpenFilterSearchUserModal);
      if (value.username) {
        setFilterItems(
          filterItems.map((filter) =>
            filter.type === "Search"
              ? { ...filter, name: value.username }
              : filter
          )
        );
        func({ val: "" });
      }
    }
  };
  return (
    <>
      <div className="filter-section">
        <div className="filter-section">
          <div className="filterIcon">
            <img src={filterIcon} alt="" style={{ width: "15px" }} />
          </div>
          {/* <span>Date created</span> */}
          {filterItems.map((item, idx) => {
            return (
              <div
                className="dateTime-picker"
                onClick={() => {
                  handleToggleFilterModal({}, item.type);
                }}
                key={item.id}
              >
                <span key={idx}>{item.name}</span>
                <i
                  className="fa-solid fa-caret-down"
                  style={{ marginLeft: "5px" }}
                ></i>
              </div>
            );
          })}
        </div>
        <div
          className="filterIcon clearFilter"
          onClick={() => {
            setFilterItems(InitFilter());
            func({ date: undefined });
          }}
        >
          <img src={clearFilter} style={{ width: "18px", display: "end" }} />
        </div>
      </div>
      <FilterModal
        open={isOpenFilterDateModal}
        toggle={handleToggleFilterModal}
      />
      {isOpenFilterSearchUserModal ? (
        <FilterUerModal
          open={isOpenFilterSearchUserModal}
          toggle={handleToggleFilterModal}
        />
      ) : (
        <></>
      )}
    </>
  );
}
export default Filter;
