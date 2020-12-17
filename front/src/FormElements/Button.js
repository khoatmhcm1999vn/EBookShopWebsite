import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

import classes from "./Button.css";

const button = (props) =>
  !props.link ? (
    <button
      className={[
        `${classes.Button}`,
        `${classes.Button}--${props.design}`,
        `${classes.Button}--${props.mode}`,
      ].join(" ")}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? "Loading..." : props.children}
    </button>
  ) : (
    <Link
      className={[
        `${classes.Button}`,
        `${classes.Button}--${props.design}`,
        `${classes.Button}--${props.mode}`,
      ].join(" ")}
      to={props.link}
    >
      {props.children}
    </Link>
  );

export default button;
