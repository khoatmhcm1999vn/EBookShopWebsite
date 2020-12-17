import React from "react";

import classes from "./Image.css";

const image = ({ item, url, imageUrl, contain, left }) => (
  <div className={classes.Image}>
    <img
      src={`http://localhost:8090/images/${imageUrl}`}
      alt=""
      style={{
        maxHeight: "70%",
        maxWidth: "70%",
        // backgroundImage: `url/('${imageUrl}')`,
        // backgroundSize: contain ? "contain" : "cover",
        // backgroundPosition: left ? "left" : "center",
      }}
    />
  </div>

  // src={`http://localhost:8090/${props.img}`}
  // alt="abc"
);

export default image;
