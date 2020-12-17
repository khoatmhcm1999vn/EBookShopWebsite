import React, { useState, useEffect } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (c) => () => {
    // return the first index or -1
    // return -1 if categoryId is not in the checked state
    const currentCategoryId = checked.indexOf(c);
    const newCheckedCategoryId = [...checked];
    // if -1, push it to the state, else splice it out
    // if currently checked was not already in checked state > push
    // else pull / take off
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(c);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    console.log(newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    // pass [ids] to parent components
    handleFilters(newCheckedCategoryId);
  };

  return categories.map((c, i) => (
    <li className="list-unstyled ml-4" key={c._id}>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input "
          onChange={handleToggle(c._id)}
          value={checked.indexOf(c._id === -1)}
        />
        <label className="form-check-label font-weight-bold">{c.name}</label>
      </div>
    </li>
  ));
};

export default Checkbox;
