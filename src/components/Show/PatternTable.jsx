import { Table, PaginationItem, PaginationLink } from "reactstrap";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { GET, POST } from "../../functionHelper/APIFunction";
import { NotificationManager } from "react-notifications";
import "../../styles/common.css";
import Filter from "../Filter/Filter";
import SearchBar from "../Filter/SearchBar";
import LoadingAnt from "../Loading/LoadingAnt";
function PatternTable() {
  const [patterns, setPatterns] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(true);
  const getPattern = (page, pageSize) => {
    let body = {
      page: page,
      size: pageSize,
    };
    POST(
      process.env.REACT_APP_BASE_URL + "api/pattern/get_pagination",
      JSON.stringify(body)
    )
      .then((res) => {
        res.items.map((item) => {
          const createdDate = new Date(item.created_date);
          const updatedDate = new Date(item.last_updated_date);
          item.created_date = createdDate.toLocaleString("en-US");
          item.last_updated_date = updatedDate.toLocaleString("en-US");
          return item;
        });
        setLoading(false);
        setPatterns(res.items);
        setPagination({
          totalItem: res.total_items,
          totalPage: res.total_pages,
        });
      })
      .catch((err) => {
        NotificationManager.error("Some things went wrong!", "success");
        console.log(err);
      });
  };
  useEffect(() => {
    getPattern(1, 12);
  }, []);

  const handleFilter = ({ val, date }) => {
    let body = {
      page: 1,
      size: 12,
      // keyword: val,
    };
    if (date) {
      let fromDate = new Date(date.fromDate + " 00:00:00");
      let toDate = new Date(date.toDate + " 23:59:59");
      body.date_filters = [
        {
          field_name: "created_date",
          from_date: fromDate * 1,
          to_date: toDate * 1,
        },
      ];
    }
    if (val) {
      body.keyword = val;
    }
    POST(
      process.env.REACT_APP_BASE_URL + `api/pattern/get_pagination/`,
      JSON.stringify(body)
    ).then((res) => {
      res.items.map((item) => {
        const createdDate = new Date(item.created_date);
        const updatedDate = new Date(item.last_updated_date);
        item.created_date = createdDate.toLocaleString("en-US");
        item.last_updated_date = updatedDate.toLocaleString("en-US");
        return item;
      });
      setPatterns(res.items);
      setPagination({
        totalItem: res.total_items,
        totalPage: res.total_pages,
      });
    });
  };
  const handleJumpPagination = (page, pageSize) => {
    getPattern(page, pageSize);
  };
  return (
    <>
      <div className="btn-section"></div>

      <Filter func={handleFilter} />

      <div className="shadow-sm table-area">
        <div className="header-Table">
          <SearchBar func={handleFilter} />
          <span className="total-script">
            Total:{pagination.totalItem} Patterns
          </span>
        </div>
        <Table borderless hover responsive className="tableData">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <span className="vertical" />
                Pattern name
              </th>
              <th>
                <span className="vertical" />
                Intent
              </th>
              <th>
                <span className="vertical" />
                Created at
              </th>
              <th style={{ width: "15%" }}>
                <span className="vertical" />
                <i className="fa-regular fa-square-minus"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {patterns.map((pattern, idx) => {
              return (
                <tr key={pattern.id}>
                  <td>{++idx}</td>
                  <td>{pattern.content}</td>
                  <td>{pattern.intent_name}</td>
                  <td>{pattern.created_date}</td>
                  {/* <td className="d-flex action-row">
                    <div onClick={() => {}}>
                      <i className="fa-solid fa-pen-to-square text-primary"></i>
                    </div>
                    <div onClick={() => {}}>
                      <i
                        className="fa-regular fa-eye "
                        style={{ color: "#56cc6e" }}
                      ></i>
                    </div>
                    <div onClick={() => {}}>
                      <i className="fa-solid fa-trash-can text-danger"></i>
                    </div>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div
          className="d-flex justify-content-center"
          style={{ width: "100%" }}
        >
          <LoadingAnt display={isLoading} />
        </div>

        <Pagination
          showQuickJumper
          defaultCurrent={2}
          total={pagination.totalItem}
          pagesize={12}
          onChange={handleJumpPagination}
        />
      </div>
    </>
  );
}

export default PatternTable;
