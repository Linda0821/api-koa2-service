const mongoose = require('mongoose');

// 账户的数据库模型
let CodeSchema = new mongoose.Schema({
  PhoneNum:String,
  VerifyCode:String,
  CreateTime: Date,
  AccessToken:String,
});
let Code = mongoose.model('Code',CodeSchema)

module.exports = Code;
