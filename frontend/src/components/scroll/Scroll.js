import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  toTop: {
    zIndex: 2,
    position: "fixed",
    bottom: "2vh",
    backgroundColor: "#669999",
    color: "black",
    "&:hover, &.Mui-focusVisible": {
      transition: "0.3s",
      color: "#ffffff",
      backgroundColor: "#ff3333",
    },
    right: "3%",
  },
}));

const Scroll = ({ showBelow }) => {
  const [show, setShow] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (showBelow) {
      window.addEventListener(`scroll`, handleScroll);
      return () => window.removeEventListener(`scroll`, handleScroll);
    }
  }, []);

  const handleScroll = () => {
    if (window.pageYOffset > showBelow) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const handleClick = () => {
    window[`scrollTo`]({ top: 0, behavior: `smooth` });
    showBelow = 0;
  };

  return (
    <div>
      {show && (
        <IconButton onClick={handleClick} className={classes.toTop}>
          <ExpandLessIcon />
        </IconButton>
      )}
    </div>
  );
};

export default Scroll;
