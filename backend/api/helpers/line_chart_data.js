import async from "async";
import Bill from "../models/bill.model.js";
import moment from "moment";
import _ from "lodash";

const lineChartData = (request, response) => {
  async.parallel(
    [
      //sunday
      function (callback) {
        Bill.find(
          {
            createdAt: {
              $gt: moment().startOf("week"),
              $lt: moment().startOf("week").weekday(1),
            },
          },
          {
            totalPrice: 1,
          }
        ).exec((err, sunday) => {
          callback(null, sunday);
        });
      },
      //Monday
      function (callback) {
        Bill.find(
          {
            createdAt: {
              $gt: moment().startOf("week").weekday(1),
              $lt: moment().startOf("week").weekday(2),
            },
          },
          {
            totalPrice: 1,
          }
        ).exec((err, monday) => {
          callback(null, monday);
        });
      },
      // TueDay
      function (callback) {
        Bill.find(
          {
            createdAt: {
              $gt: moment().startOf("week").weekday(2),
              $lt: moment().startOf("week").weekday(3),
            },
          },
          {
            totalPrice: 1,
          }
        ).exec((err, tueDay) => {
          callback(null, tueDay);
        });
      },
      // WedDay
      function (callback) {
        Bill.find(
          {
            createdAt: {
              $gt: moment().startOf("week").weekday(3),
              $lt: moment().startOf("week").weekday(4),
            },
          },
          {
            totalPrice: 1,
          }
        ).exec((err, wedDay) => {
          callback(null, wedDay);
        });
      },
      // ThuDay
      function (callback) {
        Bill.find(
          {
            createdAt: {
              $gt: moment().startOf("week").weekday(4),
              $lt: moment().startOf("week").weekday(5),
            },
          },
          {
            totalPrice: 1,
          }
        ).exec((err, thuDay) => {
          callback(null, thuDay);
        });
      },
      // friDay
      function (callback) {
        Bill.find(
          {
            createdAt: {
              $gt: moment().startOf("week").weekday(5),
              $lt: moment().startOf("week").weekday(6),
            },
          },
          {
            totalPrice: 1,
          }
        ).exec((err, friDay) => {
          callback(null, friDay);
        });
      },
      // satunDay
      function (callback) {
        Bill.find(
          {
            createdAt: {
              $gt: moment().startOf("week").weekday(6),
              $lt: moment().startOf("week").weekday(7),
            },
          },
          {
            totalPrice: 1,
          }
        ).exec((err, satunDay) => {
          callback(null, satunDay);
        });
      },
    ],
    function (err, results) {
      return response.json({
        sunday: _.sumBy(results[0], "totalPrice"),
        monday: _.sumBy(results[1], "totalPrice"),
        tueDay: _.sumBy(results[2], "totalPrice"),
        weDay: _.sumBy(results[3], "totalPrice"),
        thuDay: _.sumBy(results[4], "totalPrice"),
        friDay: _.sumBy(results[5], "totalPrice"),
        satuDay: _.sumBy(results[6], "totalPrice"),
      });
    }
  );
};
export default lineChartData;
