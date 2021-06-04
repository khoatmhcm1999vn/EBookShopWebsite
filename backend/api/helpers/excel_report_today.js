import mongoose from "mongoose";
import bluebird from "bluebird";
const { Promise } = bluebird;
mongoose.Promise = Promise;
import moment from "moment";
import _ from "lodash";
import Bill from "../models/bill.model.js";
import xl from "excel4node";
import Report from "../models/report.model.js";

const todayReport = () => {
  new Promise((resolve, reject) => {
    let startDay = new Date(moment().startOf("month"));
    let endDay = new Date(moment().endOf("month"));
    let now = moment().format("DD_MM_YYYY");

    mongoose.connect(
      "mongodb+srv://myMongoDBUser:Abc123456@cluster0.kpppm.mongodb.net/bookshop?retryWrites=true",
      {
        // useMongoClient: true,
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // useUnifiedTopology: true,
        promiseLibrary: bluebird,
      }
    );

    let report = new Report({
      path: `files/${now}.xlsx`,
      title: `Báo cáo tổng hợp ngày ${now}`,
    });
    // console.log(report);
    report.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("ok");
      }
    });

    Bill.aggregate([
      { $unwind: "$products" },
      {
        $match: {
          createdAt: {
            $gt: startDay,
            $lt: endDay,
          },
        },
      },
      {
        $group: {
          _id: "$products.name",
          total: { $sum: "$products.price" },
          earned: { $sum: "$products.count" },
        },
      },
      { $sort: { total: -1 } },
    ]).exec((err, records) => {
      if (err) {
        return reject(err);
      }
      mongoose.connection.close();
      console.log(records);
      return resolve({
        daySum: _.sumBy(records, function (o) {
          return o.total;
        }),
        dayEarn: _.sumBy(records, function (o) {
          return o.earned;
        }),
        time: now,
      });
    });
  })
    .then((data) => {
      console.log(data);
      let wb = new xl.Workbook();
      let ws = wb.addWorksheet("Sheet 1");

      let style = wb.createStyle({
        font: {
          color: "#FF0800",
          size: 12,
        },
        numberFormat: "$#,##0.00; ($#,##0.00); -",
      });

      // Hàng đầu tiên trong file excel
      ws.cell(1, 1).string("Tổng doanh thu hôm nay").style(style);
      ws.cell(1, 2).string("Số sản phẩm bán ra").style(style);

      // Hàng thứ 2
      ws.cell(2, 1).number(data.daySum).style(style);
      ws.cell(2, 2).number(data.dayEarn).style(style);

      // Xuất file và lưu vào public/report
      wb.write(`../../../files/${data.time}.xlsx`);
      // wb.write(`${__basedir}/files/${data.time}.xlsx`);
      // return res.json({ msg: "fail" });
    })
    .catch((err) => {
      throw new Error("Lỗi truy vấn");
    });
};
export default todayReport;
