import React from "react";

import classes from "./Paginator.css";

const Paginator = (props) => (
  <div className={classes.Paginator}>
    {props.children}
    <div className={classes.Paginator__controls}>
      {props.currentPage > 1 && (
        <button
          className={classes.Paginator__control}
          onClick={props.onPrevious}
        >
          Previous
        </button>
      )}
      {props.currentPage < props.lastPage && (
        <button className={classes.Paginator__control} onClick={props.onNext}>
          Next
        </button>
      )}
    </div>
  </div>
);

export default Paginator;
