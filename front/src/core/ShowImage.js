import React from "react";
import { API } from "../config";

import classes from "./ShowImage.css";

const ShowImage = ({ item, url, imageUrl, contain, left }) => (
  <div className={classes.ShowImage}>
    <img
      src={imageUrl}
      alt="abc"
      className={classes.abc}
      style={{
        // maxHeight: "100%",
        // maxWidth: "100%",
        // backgroundImage: `url('${imageUrl}')`,
        backgroundSize: contain ? "contain" : "cover",
        backgroundPosition: left ? "left" : "center",
      }}
    />
  </div>
);

export default ShowImage;
