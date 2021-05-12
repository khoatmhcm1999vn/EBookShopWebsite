import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

// create a dom reffrence for our Customized date picker icon
const ref = React.createRef();

/**
 * Customise input component for the date picker component
 * replace the default date picker component with with a calendar icon
 */
const DatePickerCustomInput = React.forwardRef(({ onClick }, ref) => (
  <div className="calendar_icon" ref={ref}>
    <FiCalendar onClick={onClick} />
  </div>
));

const DatePickerCallendarIcon = (props) => {
  return (
    <div className="datepicker" style={style}>
      <DatePicker
        locale="vi"
        selected={props.createdAt}
        onChange={props.handleDateChange}
        customInput={<DatePickerCustomInput ref={ref} />}
        dateFormat="yyyy/MM/dd"
      />
    </div>
  );
};

const style = {
  display: "inline-block",
  marginLeft: "6px",
  fontSize: "1em",
  color: "#32e0c4",
  cursor: "pointer",
};

export default DatePickerCallendarIcon;
