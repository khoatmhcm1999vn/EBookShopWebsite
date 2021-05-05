import React from "react";

export default function DateRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = new Date(preFilteredRows[0].values[id]);
    let max = new Date(preFilteredRows[0].values[id]);
    preFilteredRows.forEach((row) => {
      min = new Date(row.values[id]) <= min ? new Date(row.values[id]) : min;
      max = new Date(row.values[id]) >= max ? new Date(row.values[id]) : max;
    });
    return [min, max];
  }, [id, preFilteredRows]);
  console.log(min, max);
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <input
        value={filterValue[0] || ""}
        type="date"
        min={min.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          console.log(e.target.value);
          setFilter((old = []) => [val ? val : undefined, old[1]]);
        }}
        style={{
          width: "170px",
          marginRight: "0.5rem",
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="date"
        max={max.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [old[0], val ? val : undefined]);
        }}
        style={{
          width: "170px",
          marginLeft: "0.5rem",
        }}
      />
    </div>
  );
}
