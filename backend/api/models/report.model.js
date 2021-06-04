import mongoose from "mongoose";
import bluebird from "bluebird";
const { Promise } = bluebird;
mongoose.Promise = Promise;
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const reportSchema = new mongoose.Schema({
  path: String,
  title: String,
  createdOn: { type: Date, default: Date.now },
});
const Report = mongoose.model("Report", reportSchema);
export default Report;
