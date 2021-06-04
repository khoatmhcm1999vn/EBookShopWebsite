import cron from "cron";
import todayReport from "../helpers/excel_report_today.js";

const job = new cron.CronJob({
  cronTime: "00 00 19 * * 0-6",
  onTick: function () {
    todayReport();
    console.log("Cron job runing...");
  },
  start: true, // True, chạy job này, false không chạy
  timeZone: "Asia/Ho_Chi_Minh", // Lưu ý set lại time zone cho đúng
});

job.start();
