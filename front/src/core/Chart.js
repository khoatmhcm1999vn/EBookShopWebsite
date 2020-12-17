import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";

const Chart = ({ data }) => {
  console.log(data);

  return (
    <Line
      data={data}
      options={{ responsive: true, height: "600px", width: "600px" }}
    />
  );
};

export default Chart;

// class Chart extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       chartData: props.chartData,
//     };
//   }

//   static defaultProps = {
//     displayTitle: true,
//     displayLegend: true,
//     legendPosition: "right",
//     location: "City",
//   };

//   render() {
//     return (
//       <div className="Chart">
//         <Line
//           data={this.state.chartData}
//           options={{
//             title: {
//               display: this.props.displayTitle,
//               text: "Largest Cities in " + this.props.location,
//               fontsize: 25,
//             },
//             legend: {
//               display: this.props.displayLegend,
//               position: this.props.legendPosition,
//             },
//           }}
//         />
//       </div>
//     );
//   }
// }

// export default Chart;
