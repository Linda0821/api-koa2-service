const mongoose = require('mongoose');

// 账户的数据库模型
let StudentSchema = new mongoose.Schema({
  Username:String,
  PhoneNum:String,
  PhoneNumVerified:Boolean,
  VerifyCode:String,
  AccessToken:String,
  AuthData:Object
});
let Student = mongoose.model('Student',StudentSchema)

module.exports = Student;
