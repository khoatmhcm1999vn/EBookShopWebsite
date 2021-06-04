import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  // createdAt: { type: Date, required: true, default: Date.now, expires: 60 }
  createdAt: { type: Date, default: Date.now, expires: 120 },
});
const Token = mongoose.model("Token", tokenSchema);
export default Token;
