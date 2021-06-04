import React, { useState } from "react"
// import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from "react-bootstrap/Table"

import {
  useTable,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  useExpanded,
  usePagination,
  useSortBy,
  useRowSelect
} from "react-table"

import { matchSorter } from "match-sorter"

import { useExportData } from "react-table-plugins"
import { useSelector, useDispatch } from "react-redux"
import Papa from "papaparse"
import XLSX from "xlsx"
import JsPDF from "jspdf"
import "jspdf-autotable"

import "./Table.css"

import swal from "sweetalert"
import styled from "styled-components"
import Filters from "../../screens/BookScreen/Filters"

// const EditableCell = ({
//   value: initialValue,
//   row: { values },
//   column: { id },
//   updateMyData, // This is a custom function that we supplied to our table instance
//   editable,
// }) => {
//   // We need to keep and update the state of the cell normally
//   const [value, setValue] = React.useState(initialValue);
//   const onChange = (e) => {
//     setValue(e.target.value);
//   };
//   // We'll only update the external data when the input is blurred
//   const onBlur = () => {
//     updateMyData(values._id, id, value);
//   };
//   // If the initialValue is changed external, sync it up with our state
//   React.useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);
//   return <input value={value} onChange={onChange} onBlur={onBlur} />;
// };
// const IndeterminateCheckbox = React.forwardRef(
//   ({ indeterminate, ...rest }, ref) => {
//     const defaultRef = React.useRef();
//     const resolvedRef = ref || defaultRef;
//     React.useEffect(() => {
//       resolvedRef.current.indeterminate = indeterminate;
//     }, [resolvedRef, indeterminate]);
//     return (
//       <>
//         <input type="checkbox" ref={resolvedRef} {...rest} />
//       </>
//     );
//   }
// );
// function dateBetweenFilterFn(rows, id, filterValues) {
//   let sd = new Date(filterValues[0]);
//   let ed = new Date(filterValues[1]);
//   console.log(rows, id, filterValues);
//   return rows.filter((r) => {
//     var time = new Date(r.values[id]);
//     console.log(time, ed, sd);
//     if (filterValues.length === 0) return rows;
//     return time >= sd && time <= ed;
//   });
// }
// dateBetweenFilterFn.autoRemove = (val) => !val;
// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length
  return (
    <input
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}
// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])
  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
export function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the min and max
  // using the preFilteredRows
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])
  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  )
}
// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id }
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])
  return (
    <div
      style={{
        display: "flex"
      }}
    >
      <input
        value={filterValue[0] || ""}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem"
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
          marginLeft: "0.5rem"
        }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val
// This could be inlined into SubRowAsync, this this lets you reuse it across tables
// function SubRows({ row, rowProps, visibleColumns, data, loading }) {
//   if (loading) {
//     return (
//       <tr>
//         <td />
//         <td colSpan={visibleColumns.length - 1}>Loading...</td>
//       </tr>
//     );
//   }
//   // error handling here :)
//   return (
//     <>
//       {data.map((x, i) => {
//         return (
//           <tr {...rowProps} key={`${rowProps.key}-expanded-${i}`}>
//             {row.cells.map((cell) => {
//               return (
//                 <td {...cell.getCellProps()}>
//                   {cell.render(cell.column.SubCell ? "SubCell" : "Cell", {
//                     value: cell.column.accessor && cell.column.accessor(x, i),
//                     row: { ...row, original: x },
//                   })}
//                 </td>
//               );
//             })}
//           </tr>
//         );
//       })}
//     </>
//   );
// }
// export function SubRowAsync({ row, rowProps, visibleColumns }) {
//   const [loading, setLoading] = React.useState(true);
//   const [data, setData] = React.useState([]);
//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       // setData(makeData(3));
//       setLoading(false);
//     }, 500);
//     return () => {
//       clearTimeout(timer);
//     };
//   }, []);
//   return (
//     <SubRows
//       row={row}
//       rowProps={rowProps}
//       visibleColumns={visibleColumns}
//       data={data}
//       loading={loading}
//     />
//   );
// }

export default function Table({
  setRun,
  columns,
  data,
  parent_action,
  // renderRowSubComponent,
  // updateMyData,
  // skipPageReset,
  style
}) {
  const dispatchx1 = useDispatch()
  const [filterInput, setFilterInput] = useState("")
  // Create an editable cell renderer
  const Styles = styled.div`
    padding: 1rem;
    table {
      width: 30%;
      border-spacing: 0;
      border: 1px solid black;
      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }
      th,
      td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        :last-child {
          border-right: 0;
        }
        input {
          font-size: 1rem;
          padding: 0;
          margin: 0;
          border: 0;
        }
      }
    }
    .pagination {
      padding: 0.5rem;
    }
    .table {
      width: 30%;
    }
  `

  const filterTypes = React.useMemo(
    () => ({
      dateFilter: (rows, id, filterValue) => {
        return (rows = rows.filter(row => {
          return (
            new Date(row.values.createdAt) >= filterValue[0] &&
            new Date(row.values.createdAt) <= filterValue[1]
          )
        }))
      },
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      }
    }),
    []
  )
  // const filterTypes = React.useMemo(
  //   () => ({
  //     // Add a new fuzzyTextFilterFn filter type.
  //     fuzzyText: "abc",
  //     dateBetween: dateBetweenFilterFn /*<- LIKE THIS*/,
  //     text: (rows, id, filterValue) => {
  //       return rows.filter((row) => {
  //         const rowValue = row.values[id];
  //         return rowValue !== undefined
  //           ? String(rowValue)
  //               .toLowerCase()
  //               .startsWith(String(filterValue).toLowerCase())
  //           : true;
  //       });
  //     },
  //   }),
  //   []
  // );
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
      // And also our default editable cell
      // Cell: EditableCell,
    }),
    []
  )
  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "csv") {
      // CSV example
      const headerNames = columns
        .filter(c => c.Header !== "Action")
        .map(col => col.exportValue)
      const csvString = Papa.unparse({ fields: headerNames, data })
      return new Blob([csvString], { type: "text/csv" })
    } else if (fileType === "xlsx") {
      // XLSX example
      const header = columns
        .filter(c => c.Header !== "Action")
        .map(c => c.exportValue)
      const compatibleData = data.map(row => {
        const obj = {}
        header.forEach((col, index) => {
          // if (Array.isArray(row[index])) {
          //   // console.log(row[index]);
          //   row[index].forEach((i) => {
          //     // console.log(i);
          //     let b = "" + ",";
          //     b = i;
          //     b.concat(",");
          //     row[index] = b;
          //     console.log(row[index]);
          //   });
          //   console.log(row[index]);
          //   // obj[col] = row[index];
          // }
          obj[col] = row[index]
        })
        return obj
      })
      let wb = XLSX.utils.book_new()
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        header
      })
      XLSX.utils.book_append_sheet(wb, ws1, "React Table Data")
      XLSX.writeFile(wb, `${fileName}.xlsx`)
      // Returning false as downloading of file is already taken care of
      return false
    }
    // PDF example
    if (fileType === "pdf") {
      const headerNames = columns
        .filter(c => c.Header !== "Action")
        .map(column => column.exportValue)
      const doc = new JsPDF()
      doc.autoTable({
        head: [headerNames],
        body: data,
        styles: {
          minCellHeight: 40,
          halign: "left",
          valign: "center",
          fontSize: 6
        }
      })
      doc.save(`${fileName}.pdf`)
      return false
    }
    // Other formats goes here
    return false
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    // rows,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    setFilter,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    exportData,
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    setGlobalFilter,
    preGlobalFilteredRows,
    dispatch,
    visibleColumns,
    state: {
      pageIndex,
      pageSize,
      selectedRowIds,
      globalFilter,
      sortBy,
      groupBy,
      expanded,
      filters,
      hiddenColumns
    }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // updateMyData,
      // skipPageReset,
      initialState: { pageIndex: 0 },
      getExportFileBlob,
      filterTypes
      // autoResetPage: !skipPageReset,
      // autoResetSelectedRows: !skipPageReset,
      // disableMultiSort: true,
      // manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      // pageCount: controlledPageCount,
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useExportData,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: "selection",
          // accessor: '_id',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          groupByBoundary: true,
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
        ...columns
      ])
    }
  )

  const handleFilterChange = e => {
    const value = e.target.value || undefined
    // setFilter("name", value);
    setFilter("name", value)
    setFilterInput(value)
  }
  const BulkDelete = (selectedFlatRows, parent_action) => {
    let selected_id = selectedFlatRows.map(data => {
      return data.values._id
    })
    console.log(selected_id)
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        // dispatchx1(parent_action.bulk_delete(selected_id));
        parent_action.bulk_delete(selected_id)
        console.log(selected_id)
        // dispatch(parent_action.bulk_delete(selected_id));
        swal("Poof! Your Bill data has been deleted!", {
          icon: "success"
        })
      }
    })
  }
  // Render the UI for your table
  // console.log(footerGroups)
  // Listen for changes in pagination and use the state to fetch our new data
  // React.useEffect(() => {
  //   console.log(pageIndex);
  //   fetchData({ pageIndex, pageSize });
  // }, [fetchData, pageIndex, pageSize]);
  // // Render the UI for your table

  //   <pre>
  //   <code>
  //     {JSON.stringify(
  //       {
  //         pageIndex,
  //         pageSize,
  //         pageCount,
  //         canNextPage,
  //         canPreviousPage,
  //       },
  //       null,
  //       2
  //     )}
  //     <code>{JSON.stringify({ groupBy, expanded }, null, 2)}</code>
  //   </code>
  // </pre>
  //  <div>
  //         <div>
  //           <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
  //           All
  //         </div>
  //         {allColumns.map((column) => (
  //           <div key={column.id}>
  //             <label>
  //               <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
  //               {column.id}
  //             </label>
  //           </div>
  //         ))}
  //         <br />
  //       </div>

  return (
    <Styles>
      <Filters
        setFilter={setFilter}
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        dispatch={dispatch}
      />
      <div className="form-group input-group">
        <button
          class="btn btnexport mr-1"
          onClick={() => {
            exportData("csv", true)
          }}
        >
          <i className="fa fa-file-csv"></i> Export as CSV
        </button>
        <button
          class="btn btnexport mr-1"
          style={style}
          onClick={() => {
            exportData("xlsx", true)
          }}
        >
          <i class="fa fa-file-excel"></i> Export as xlsx
        </button>
        <button
          class="btn btnexport mr-1"
          onClick={() => {
            exportData("pdf", true)
          }}
        >
          <i class="fa fa-file-pdf"></i>
          Export as PDF
        </button>
        {Object.keys(selectedRowIds).length !== 0 ? (
          <button
            class="btn btn-danger"
            onClick={() => {
              BulkDelete(selectedFlatRows, parent_action)
            }}
          >
            <i class="fa fa-trash"></i>
            Delete {Object.keys(selectedRowIds).length} row
          </button>
        ) : (
          ""
        )}
      </div>
      {/* <div className="form-group input-group">
        <input
          className="form-control"
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={"Search name"}
          disabled={setRun}
          style={style}
        />
      </div> */}
      {/* <Legend />
      <pre>
        <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
      </pre> */}
      <Legend />
      <BTable
        {...getTableProps()}
        className="table table-bordered table-condensed table-responsive"
        style={{ display: "table" }}
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? "🛑 " : "👊 "}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            const rowProps = row.getRowProps()
            return (
              <>
                <tr {...rowProps}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          background: cell.isGrouped
                            ? "#0aff0082"
                            : cell.isAggregated
                            ? "#ffa50078"
                            : cell.isPlaceholder
                            ? "#ff000042"
                            : "white"
                        }}
                      >
                        {cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <span
                              {...row.getToggleRowExpandedProps({
                                style: {
                                  // We can even use the row.depth property
                                  // and paddingLeft to indicate the depth
                                  // of the row
                                  paddingLeft: `${row.depth * 2}rem`
                                }
                              })}
                            >
                              {row.isExpanded ? "👇" : "👉"}
                            </span>
                            {cell.render("Cell", { editable: false })} (
                            {row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render("Aggregated")
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render("Cell", { editable: true })
                        )}
                      </td>
                    )
                  })}
                </tr>
                {/* {row.isExpanded &&
                  renderRowSubComponent({ row, rowProps, visibleColumns })} */}
                {/* <tr>
                  {loading ? (
                    // Use our custom loading state to show a loading indicator
                    <td colSpan="10000">Loading...</td>
                  ) : (
                    <td colSpan="10000">
                      Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                      results
                    </td>
                  )}
                </tr> */}
              </>
            )
          })}
        </tbody>
        <tfoot>
          {footerGroups.map(group => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map(column => (
                <td {...column.getFooterProps()}>{column.render("Footer")}</td>
              ))}
            </tr>
          ))}
        </tfoot>
      </BTable>
      {/* <br />
      <div>Showing the first 20 results of {page.length} rows</div>
      <pre>
        <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
      </pre> */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              console.log(page)
              gotoPage(page)
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <pre>
          {/* <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                "selectedFlatRows[].original": selectedFlatRows.map(
                  (d) => d.original
                ),
              },
              null,
              2
            )}
          </code> */}
          <code>
            {JSON.stringify(
              {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
                sortBy,
                groupBy,
                expanded: expanded,
                filters,
                selectedRowIds: selectedRowIds
              },
              null,
              2
            )}
          </code>
          {/* <pre>{JSON.stringify(hiddenColumns, null, 2)}</pre> */}
        </pre>
      </div>
    </Styles>
  )
}
// Define a custom filter filter function!
export function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}
// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== "number"
function roundedMedian(leafValues) {
  let min = leafValues[0] || 0
  let max = leafValues[0] || 0
  leafValues.forEach(value => {
    min = Math.min(min, value)
    max = Math.max(max, value)
  })
  return Math.round((min + max) / 2)
}
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])
    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)
// const data = React.useMemo(() => makeData(10000), [])
function Legend() {
  return (
    <div
      style={{
        padding: "0.5rem 0"
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "#0aff0082",
          padding: "0.5rem"
        }}
      >
        Grouped
      </span>
      <span
        style={{
          display: "inline-block",
          background: "#ffa50078",
          padding: "0.5rem"
        }}
      >
        Aggregated
      </span>
      <span
        style={{
          display: "inline-block",
          background: "#ff000042",
          padding: "0.5rem"
        }}
      >
        Repeated Value
      </span>
    </div>
  )
}
