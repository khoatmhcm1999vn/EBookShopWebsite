import React from "react";
import BTable from "react-bootstrap/Table";
import styled from "styled-components";
import { useTable, usePagination } from "react-table";
import makeData from "./makeData";
import Axios from "axios";

const Styles = styled.div`
  padding: 1rem;
  table {
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
    }
  }
  .pagination {
    padding: 0.5rem;
  }
`;
// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    usePagination
  );
  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);
  // Render the UI for your table

  // console.log(page);

  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>
      <BTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan="10000">Loading...</td>
            ) : (
              <td colSpan="10000">
                Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                results
              </td>
            )}
          </tr>
        </tbody>
      </BTable>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
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
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              console.log(page);
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

const makeDataa1 = async () => {
  const res = await Axios.post(`http://localhost:8090/api/getAllBook`);
  return res.data;
};
// Let's simulate a large dataset on the server (outside of our component)
// const serverData =  async() => await makeDataa1();

function BookTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "name",
          },
          //   {
          //     Header: "Last Name",
          //     accessor: "lastName",
          //   },
        ],
      },
      {
        Header: "Front Image",
        accessor: "img",
        Cell: ({ cell: { value } }) => (
          <img class="img-fluid img-rounded" width={200} src={value} alt="a" />
        ),
      },
      {
        Header: "Published",
        accessor: "convertedZipCode",
        // Filter: SelectColumnFilter,
        filter: "includes",
        Cell: ({ cell: { value } }) => {
          switch (value) {
            case "true":
              return (
                <div
                  className="transaction-status"
                  style={{ background: "green" }}
                ></div>
              );
            case "false":
              return (
                <div
                  className="transaction-status"
                  style={{ background: "red" }}
                ></div>
              );
            default:
              return (
                <div
                  className="transaction-status"
                  style={{ background: "yellow" }}
                ></div>
              );
          }
        },
      },
      // {
      //   Header: "Info",
      //   columns: [
      //     {
      //       Header: "Price",
      //       accessor: "price",
      //     },
      //     {
      //       Header: "Quantity",
      //       accessor: "quantity",
      //     },
      //     {
      //       Header: "Status",
      //       accessor: "status",
      //     },
      //     {
      //       Header: "Profile Progress",
      //       accessor: "progress",
      //     },
      //   ],
      // },
    ],
    []
  );
  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(async ({ pageSize, pageIndex }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current;
    const pageIdx = pageIndex + 1;
    // console.log(pageIdx)
    // Set the loading state
    setLoading(true);
    const res = await Axios.post(
      `http://localhost:8090/api/getAllBook?pageIndex=${pageIdx}&pageSize=${pageSize}`
    );
    const {
      data: { datax1, pageIndexx1, pageSizex1 },
    } = res;
    // console.log(datax1);
    // We'll even set a delay to simulate a server here
    setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        // console.log(pageIndexx1);
        const startRow = pageSize * 0;
        const endRow = datax1.length;
        console.log(endRow);
        setData(datax1.slice(startRow, endRow));
        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(pageSizex1));
        setLoading(false);
      }
    }, 300);
  }, []);

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
      />
    </Styles>
  );
}

export default BookTable;
