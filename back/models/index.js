const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.User = require("./userModel");
db.role = require("./roleModel");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;