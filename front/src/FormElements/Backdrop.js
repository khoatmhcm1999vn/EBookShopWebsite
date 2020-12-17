import React from "react";
import ReactDOM from "react-dom";

import classes from './Backdrop.css'

const backdrop = (props) =>
  ReactDOM.createPortal(
    <div
      className={[classes.Backdrop, props.open ? "open" : ""].join(" ")}
      onClick={props.onClick}
    />,
    document.getElementById("backdrop-root")
  );

export default backdrop;
