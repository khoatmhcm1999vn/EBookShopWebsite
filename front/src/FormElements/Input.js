import React from "react";

import "./Input.css";

import classes from "./Input.css";

const input = (props) => (
  <div className={classes.Input}>
    {props.label && <label htmlFor={props.id}>{props.label}</label>}
    {props.control === "input" && (
      <input
        className={[
          !props.valid ? "invalid" : "valid",
          props.touched ? "touched" : "untouched",
        ].join(" ")}
        type={props.type}
        id={props.id}
        required={props.required}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) =>
          props.onChange(props.id, e.target.value, e.target.files)
        }
        onBlur={props.onBlur}
      />
    )}
    {props.control === "textarea" && (
      <textarea
        className={[
          !props.valid ? "invalid" : "valid",
          props.touched ? "touched" : "untouched",
        ].join(" ")}
        id={props.id}
        rows={props.rows}
        required={props.required}
        value={props.value}
        onChange={(e) => props.onChange(props.id, e.target.value)}
        onBlur={props.onBlur}
      />
    )}
    {props.control === "select" && (
      <select
        className={[
          !props.valid ? "invalid" : "valid",
          props.touched ? "touched" : "untouched",
        ].join(" ")}
        id={props.id}
        rows={props.rows}
        required={props.required}
        value={props.value}
        onChange={(e) => props.onChange(props.id, e.target.value)}
        onBlur={props.onBlur}
      ></select>
    )}
  </div>
);

export default input;
