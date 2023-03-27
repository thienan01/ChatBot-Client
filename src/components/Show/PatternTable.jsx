// import {
//   Table,
//   Button,
//   Pagination,
//   PaginationItem,
//   PaginationLink,
//   Spinner,
// } from "reactstrap";
// import { useEffect, useState } from "react";
// import { GET, POST } from "../../functionHelper/APIFunction";
// import { BASE_URL } from "../../global/globalVar";
// import ModalUpdateIntent from "./ModalUpdateIntent";
// import ModalPattern from "./ModalPattern";
// import { NotificationManager } from "react-notifications";
// import "../../styles/common.css";
// import filterIcon from "../../assets/filter.png";
// import clearFilter from "../../assets/clear-filter.png";
// function PatternTable() {
//   const [patterns, setPatterns] = useState([]);
//   const getPattern = (intentID, page) => {
//     GET(
//       BASE_URL +
//         "api/pattern/get_pagination/by_intent_id/" +
//         intentID +
//         "?page=" +
//         page +
//         "&size=10"
//     )
//       .then((res) => {
//         console.log(res);
//         setPatterns({ intentID: intentID, patterns: res });
//       })
//       .catch((err) => {
//         NotificationManager.error("Some things went wrong!", "success");
//         console.log(err);
//       });
//   };
//   return (
//     <>
//       <div className="btn-section"></div>

//       <div className="filter-section">
//         <div className="filter-section">
//           <div className="filterIcon">
//             <img src={filterIcon} alt="" style={{ width: "15px" }} />
//           </div>
//           <div className="dateTime-picker">
//             <span>Date created</span>
//             <i class="fa-solid fa-caret-down" style={{ marginLeft: "5px" }}></i>
//           </div>
//         </div>
//         <img src={clearFilter} style={{ width: "18px", display: "end" }} />
//       </div>

//       <div className="shadow-sm table-area">
//         <div className="header-Table">
//           <div
//             className="searchArea"
//             id="searchArea"
//             style={{ width: "300px" }}
//           >
//             <i class="fa-solid fa-magnifying-glass"></i>
//             <input
//               type="search"
//               className="searchInput"
//               placeholder="Find your scripts..."
//               for="searchArea"
//             />
//           </div>
//           <span className="total-script">Total: Patterns</span>
//         </div>
//         <Table borderless hover responsive className="tableData">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>
//                 <span className="vertical" />
//                 Pattern name
//               </th>
//               <th>
//                 <span className="vertical" />
//                 Intent
//               </th>
//               <th style={{ width: "15%" }}>
//                 <span className="vertical" />
//                 <i class="fa-regular fa-square-minus"></i>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {patterns.map((intent, idx) => {
//               return (
//                 <tr key={intent.id}>
//                   <td>{++idx}</td>
//                   <td>{intent.name}</td>
//                   <td>{intent.code}</td>
//                   <td className="d-flex action-row">
//                     <div onClick={() => {}}>
//                       <i className="fa-solid fa-pen-to-square text-primary"></i>
//                     </div>
//                     <div onClick={() => {}}>
//                       <i
//                         className="fa-regular fa-eye "
//                         style={{ color: "#56cc6e" }}
//                       ></i>
//                     </div>
//                     <div onClick={() => {}}>
//                       <i className="fa-solid fa-trash-can text-danger"></i>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>

//         <Pagination aria-label="Page navigation example">
//           {Array.from({ length: pagination.totalPage }, (_, i) => (
//             <PaginationItem key={i}>
//               <PaginationLink
//                 onClick={() => {
//                   getIntent(i + 1);
//                 }}
//               >
//                 {i + 1}
//               </PaginationLink>
//             </PaginationItem>
//           ))}
//         </Pagination>

//         <ModalUpdateIntent
//           open={openUpdateModal}
//           toggle={handleToggleUpdateIntent}
//           value={currentIntent}
//           create={createIntent}
//           reload={getIntent}
//           // save={handleSaveIntent}
//         />
//         <ModalPattern
//           open={openPatternModal}
//           toggle={handleTogglePattern}
//           value={patterns}
//         />
//       </div>
//     </>
//   );
// }

// export default PatternTable;
