import React from "react"
import Spinner from "../spinner/Spinner"
import "./loading.css"

const Loading = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <Spinner />
      </div>
    </div>
  )
}
export default Loading

// import { Spinner } from "react-bootstrap";
// const Loading = () => {
//   return (
//     <div>
//       <Spinner
//         animation="border"
//         role="status"
//         style={{
//           width: "100px",
//           height: "100px",
//           margin: "auto",
//           display: "block",
//         }}
//       >
//         <span className="sr-only">Loading...</span>
//       </Spinner>
//     </div>
//   );
// };
// const Loading = () => (
//   <div className="spinner">
//     <div className="double-bounce1"></div>
//     <div className="double-bounce2"></div>
//   </div>
// );
