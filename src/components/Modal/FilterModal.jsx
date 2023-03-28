import { useState, useEffect, useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { DatePicker } from "antd";
import "./FilterModal.css";
import "../../styles/common.css";
function FilterModal({ open, toggle }) {
  return (
    <>
      <Modal
        isOpen={open}
        style={{ maxWidth: "600px" }}
        className="filterModal"
      >
        <ModalBody style={{ padding: "20px 20px" }}>
          <span className="title">Created date</span>
          <div className="time-picker-area">
            <div className="inputTitle">Time period</div>
            <div className="time-section">
              <DatePicker className="from-date date-picker" />
              <i class="fa-solid fa-arrow-right"></i>
              <DatePicker className="to-date date-picker" />
            </div>
          </div>
          <div className="btn-section-modal">
            <Button className="btn-prim" onClick={toggle}>
              Apply
            </Button>
            <Button className="closeBtn" onClick={toggle}>
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default FilterModal;
