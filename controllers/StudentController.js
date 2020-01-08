const Student = require('../models/Student');
const _ = require('loadsh');
const xss = require('xss');
const uuid = require('uuid');
const sms = require('../service/sms');
const jwt = require('jsonwebtoken');
const DroiBassUtils = require('../utile/DroiBaaSUtils');

exports.getBassToken = async (ctx, next) => {
  let ret = await DroiBassUtils.getSessionToken();
  console.info(ret);
  ctx.status = 200;
  ctx.response.body = "token sucess!";

  await next();
}
exports.getStudentList = async (ctx, next) => {
  let val = null
  const data = await Student.find()
  console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  //console.info(ctx)
  ctx.response.body = result
  return result
}

exports.getVerifyCode = async (ctx, next) => {
  let val = null
  const jsonRequestBody =  ctx.request.body
  let PhoneNum  = jsonRequestBody.PhoneNum
  console.info(PhoneNum)
  let newStudent = await Student.findOne({
    PhoneNum: xss(_.trim(PhoneNum))
  }).exec();

  let VerifyCode = sms.getCode();
  console.log(VerifyCode);

  if (!newStudent) { //新用户
    let accessToken = uuid.v4();
    newStudent = new Student({
      Username: xss(_.trim('phone_'+PhoneNum)),
      PhoneNum: xss(_.trim(PhoneNum)),
      PhoneNumVerified:false,
      VerifyCode: VerifyCode,
      AccessToken: accessToken
    })
    console.log('新用户');
  } else {
    newStudent.VerifyCode = VerifyCode;
    console.log('老用户');
  }
  let result ={
    success: false,
    msg: '验证码发送失败'
  };

  try {
    await newStudent.save();
    //await sms.send(PhoneNum, VerifyCode);
    result = {
      success: true,
      msg: '验证码发送成功'
    };

  } catch (e) {
    console.info(e)
  }
  ctx.response.body = result
  return result
}

exports.LoginByPhone = async (ctx, next) => {
  const jsonRequestBody =  ctx.request.body
  let PhoneNum  = jsonRequestBody.PhoneNum
  let VerifyCode = jsonRequestBody.VerifyCode;
  let result;
  if (!PhoneNum || !VerifyCode) {
    result = {
      success: false,
      msg: '验证没通过'
    }
    console.log("手机号或密码不正确");
    ctx.response.body = result
    return result;
  }
  let newStudent = await Student.findOne({
    PhoneNum: xss(_.trim(PhoneNum)),
    VerifyCode:xss(_.trim(VerifyCode))
  }).exec();
  console.log(newStudent);
  if (newStudent) {
    newStudent.PhoneNumVerified = true;
    newStudent = await newStudent.save();
    result = {
      success: true,
      msg: '验证通过',
      response: newStudent
    }
    console.log("该用户存在");
  } else {
    result = {
      success: false,
      msg: '验证没通过'
    }
  }

  ctx.response.body = result
  return result
}
exports.deleteStudent = async (ctx, next) => {
  let val = null
  const data = await Student.remove({_id: ctx.params.id})
  //console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  ctx.response.body = result
  return result
}
exports.updateStudent = async (ctx, next) => {
  let val = null
  const jsonRequestBody =  ctx.request.body
  console.info(jsonRequestBody.Studentname)
  const data = await Student.updateOne(
    {_id: xss(_.trim(jsonRequestBody._id))},
    { $set: {
      "Username": xss(_.trim(jsonRequestBody.Studentname)),
      "password": xss(_.trim(jsonRequestBody.password)),
      "email": xss(_.trim(jsonRequestBody.email))
    } }
  )
  console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  ctx.response.body = result
  return result
}

exports.getStudentInfoById = async (ctx, next) => {
  let val = null
  console.log(ctx.params.id);
  const data = await Student.findOne({_id: ctx.params.id})
  console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  ctx.response.body = result
  return result
}