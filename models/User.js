const mongoose = require('mongoose');

// 账户的数据库模型
let UserSchema = new mongoose.Schema({
  username:String,
  password:String,
  email:String
});
let User = mongoose.model('User',UserSchema)

module.exports = User;
