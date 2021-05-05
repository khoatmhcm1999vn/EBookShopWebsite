import React, { useState } from "react";
import DatePicker from "./DatePickerCallendarIcon";
import { AiOutlineSync } from "react-icons/ai";
import { useAsyncDebounce } from "react-table";

const Filters = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categoryFilterValue, setCategoryFilterValue] = useState(null);
  const [value, setValue] = React.useState(props.globalFilter);

  const count = props.preGlobalFilteredRows.length;

  // attached to onChange event litener of Global filter text input box
  const onChange = useAsyncDebounce((value) => {
    props.setGlobalFilter(value || undefined);
  }, 200);

  // called when a user selects filter start-date
  const handleStartDate = (date) => {
    setStartDate(date);
  };
  //called when a user selects filter end-date
  const handleEndDate = (date) => {
    setEndDate(date);
  };

  // Handles Selected Category filter option and update the state
  const handleCategoryOptionsChange = (event) => {
    setCategoryFilterValue(event.target.value);
  };

  // Auto Rest All Filters
  const autoResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setCategoryFilterValue(null);
    props.dispatch({ type: "resetFilters" });
    var radios = document.querySelectorAll('input[name="category-Filters"]');
    for (let i of radios) {
      if (i.checked) {
        i.checked = false;
        break;
      }
    }
  };

  // Filter table by selected category option
  const handleFilterByCategory = () => {
    props.setFilter("category", categoryFilterValue);
  };

  // Filter table by selected start-date and end-date
  const handleFilterByDate = () => {
    if (startDate && endDate) {
      props.setFilter("createdAt", [startDate, endDate]);
    }
  };

  // Handles all calls to filter the table <-- attached to onClick event of "apply filter button" -->
  const applyFilter = () => {
    if (startDate && endDate && categoryFilterValue) {
      handleFilterByDate();
      handleFilterByCategory();
    }
    if (startDate && endDate && !categoryFilterValue) {
      handleFilterByDate();
    }
    if (!startDate && !endDate && categoryFilterValue) {
      handleFilterByCategory();
    }
    if ((!startDate && endDate) || (startDate && !endDate)) {
      window.alert("Please Make sure you select start-date and end-date");
    }
  };

  return (
    <div>
      <div className="filterParameters" id="filterParameters">
        <div className="datePickerWrapper">
          <div className="Datepicker-grid-container">
            <div>Filter </div>
            <div className="startDate">
              From:
              <div className="datePickerLabel">
                {startDate ? startDate.toLocaleDateString("fr-CA") : null}
              </div>
              <DatePicker handleDateChange={handleStartDate} date={startDate} />
            </div>
            <div className="verticalLine"></div>
            <div className="endDate">
              To:
              <div className="datePickerLabel">
                {endDate ? endDate.toLocaleDateString("fr-CA") : null}
              </div>
              <DatePicker handleDateChange={handleEndDate} date={endDate} />
            </div>
          </div>
        </div>
        <div className="resetFilter" onClick={autoResetFilter}>
          <span>Reset</span>
          <AiOutlineSync className="resetFilter_icon" />
        </div>
      </div>
      <div className="filterByCategoryOptions" id="filterByCategory">
        <div
          onChange={handleCategoryOptionsChange}
          className="filterBy-RecievedMoney"
        >
          <input
            type="radio"
            value="recieved"
            name="category-Filters"
            id="recievedMoney"
          />
          <label htmlFor="recievedMoney">Payment recieve</label>
        </div>
        <div
          onChange={handleCategoryOptionsChange}
          className="filterBy-moneySent"
        >
          <input
            type="radio"
            value="sent"
            name="category-Filters"
            id="moneySent"
          />
          <label htmlFor="moneySent">Money Sent</label>
        </div>
        <div
          onChange={handleCategoryOptionsChange}
          className="filterBy-pendingTran"
        >
          <input
            type="radio"
            value="pending"
            name="category-Filters"
            id="pendingTran"
          />
          <label htmlFor="pendingTran">Pending</label>
        </div>
        <div
          onChange={handleCategoryOptionsChange}
          className="filterBy-failedTran"
        >
          <input
            type="radio"
            value="fail"
            name="category-Filters"
            id="failedTran"
          />
          <label htmlFor="failedTran">Failed</label>
        </div>
      </div>
      <div className="apply-filter">
        <h3>All Transactions</h3>
        <button
          onClick={applyFilter}
          className="applyFilter-btn"
          id="applyFilter-btn"
        >
          Apply Filter
        </button>
      </div>
      <span className="globalFilterInput">
        Search:
        <input
          type="text"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`records by user name`}
          style={{
            fontSize: "1rem",
            border: "2px solid #32E0C4",
          }}
        ></input>
      </span>
    </div>
  );
};

export default Filters;
