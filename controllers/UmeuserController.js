const Umeuser = require('../models/Umeuser');
const Code = require('../models/Code');
const _ = require('loadsh');
const xss = require('xss');

//const uuid = require('uuid');
const sms = require('../service/sms');
const jwt = require('jsonwebtoken');
const secret = 'bose-ume-2019'; //撒盐：加密的时候混淆

const DroiBassUtils = require('../utile/DroiBaaSUtils');

/*jwt*/
const getSignJWT = async (payload) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: 60*60*2
  });
  return  token
}
const verifySignJWT = async (token) => {
    let data = await jwt.verify(token, secret,(err, decoded) => {
      if (err) {
        //验证失败
        console.log("令牌失效");
        return null
      } else {
        //验证成功
        console.log(decoded);
        return decoded
      }
    })
  return data;
}

/*设置用户参数*/
const importUsersParams = async (Data) => {
  let newUmeuser = new Umeuser();

  newUmeuser.Uid = Data._Id;
  newUmeuser.UserId = Data.UserId;

  newUmeuser._CreationTime = Data._CreationTime;
  newUmeuser._ModifiedTime = Data._ModifiedTime;

  newUmeuser.EmailVerified = Data.EmailVerified;
  newUmeuser.PhoneNumVerified = Data.PhoneNumVerified;
  newUmeuser.Enabled = Data.Enabled;

  if(Data.PhoneNum){
    newUmeuser.PhoneNum = Data.PhoneNum
  }
  if(_.isEmpty(newUmeuser.PhonePinCode)=== false){
    newUmeuser.PhonePinCode = Data.PhonePinCode
  }
  if(_.isEmpty(newUmeuser.PhoneHasTrie) === false){
    newUmeuser.PhoneHasTrie = Data.PhoneHasTrie
  }
  if(_.isEmpty(newUmeuser.EmailToken) === false){
    newUmeuser.EmailToken = Data.EmailToken
  }
  if(_.isEmpty(newUmeuser.Email) === false){
    newUmeuser.Email = Data.Email
  }

  if(_.isEmpty(newUmeuser.EmailHasTried === false)){
    newUmeuser.EmailHasTried = Data.EmailHasTried
  }
  if(_.isEmpty(newUmeuser.CurrentOTP === false)){
    newUmeuser.CurrentOTP = Data.CurrentOTP
  }
  if(_.isEmpty(newUmeuser.Nickname === false)){
    newUmeuser.Nickname = Data.Nickname
  }
  if(_.isEmpty(newUmeuser.Gender === false)){
    newUmeuser.Gender = Data.Gender
  }
  if(_.isEmpty(newUmeuser.Job === false)){
    newUmeuser.Job = Data.Job
  }
  if(_.isEmpty(newUmeuser.Education === false)){
    newUmeuser.Education = Data.Education
  }
  if(_.isEmpty(newUmeuser.InviteCode === false)){
    newUmeuser.InviteCode = Data.InviteCode
  }
  if(_.isEmpty(newUmeuser.ActivateStatus === false)){
    newUmeuser.ActivateStatus = Data.ActivateStatus
  }
  if(_.isEmpty(newUmeuser.AwakeStatus === false)){
    newUmeuser.AwakeStatus = Data.AwakeStatus
  }
  if(_.isEmpty(newUmeuser.Age === false)){
    newUmeuser.Age = Data.Age
  }
  if(_.isEmpty(newUmeuser.Coin === false)){
    newUmeuser.Coin = Data.Coin
  }
  if(_.isEmpty(newUmeuser.CoinFromApprentice === false)){
    newUmeuser.CoinFromApprentice = Data.CoinFromApprentice
  }
  if(_.isEmpty(newUmeuser.Balance === false)){
    newUmeuser.Balance = Data.Balance
  }
  if(_.isEmpty(newUmeuser.ExchangeRate === false)){
    newUmeuser.ExchangeRate = Data.ExchangeRate
  }
  if(_.isEmpty(newUmeuser.Sign === false)){
    newUmeuser.Sign = Data.Sign
  }
  if(_.isEmpty(newUmeuser.LastLoginTime === false)){
    newUmeuser.LastLoginTime = Data.LastLoginTime
  }
  if(_.isEmpty(newUmeuser.Bm_version === false)){
    newUmeuser.Bm_version = Data.Bm_version
  }
  if(_.isEmpty(newUmeuser.Prev_user_id === false)){
    newUmeuser.Prev_user_id = Data.Prev_user_id
  }
  if(_.isEmpty(newUmeuser.Prev_need_bm_syn === false)){
    newUmeuser.Prev_need_bm_syn = Data.Prev_need_bm_syn
  }
  if(_.isEmpty(newUmeuser.Prev_user_token === false)){
    newUmeuser.Prev_user_token = Data.Prev_user_token
  }
  if(_.isEmpty(newUmeuser.Icon === false)){
    newUmeuser.Icon = {
      url : 'http://browser.umeweb.com/v6/ume/img/common/tou.png'
    };
  }
  if(_.isEmpty(newUmeuser.AuthData === false)){
    newUmeuser.AuthData = Data.AuthData
  }
  newUmeuser.LoginTime = new Date();
  let newUmeUserSave = await newUmeuser.save();
  //console.info(newUmeUserSave)
  return newUmeUserSave
}

/*获取用户信息列表*/
exports.getUmeuserList = async (ctx, next) => {
  let val = null
  const data = await Umeuser.find()
  console.log('data', data)
  const result = {
    code:200,
    response: data,
    count:data.length
  }
  //console.info(ctx)
  ctx.response.body = result
  return result
}

/*批量导入用户信息*/
exports.importUserInfo = async (ctx, next) =>{
  let token = await DroiBassUtils.getSessionToken();
  console.info(token);
  let user = await DroiBassUtils.queryDroiObjects(token,'_User');
  console.info(user.Result.length)
  let DataArr = user.Result;
  for(let i in DataArr ){
    let Data = DataArr[i];
    if( Data.AuthData && Data.AuthData.anonymous){
      console.info(i);
      continue;
    }
    await importUsersParams(Data)
  }
  let result = {
    code:200,
    response: '导入成功'+user.Result.length+"条数据。"
  }
  ctx.response.body = result
  await next();
}
/**
 * auth第三方登录
 * Weixin/QQ/Sina;
 * */
exports.loginByAuth = async (ctx, next) => {
  const jsonRequestBody =  ctx.request.body
  let AuthType  = jsonRequestBody.AuthType;
  let OpenId = jsonRequestBody.OpenId;
  let AuthData,result, where;
  if (!AuthType || ! OpenId) {
    result = {
      success: false,
      msg: 'e001: 验证没通过,请检查参数'
    }
    ctx.response.body = result
    return result;
  }
  if(AuthType == 'QQ' && OpenId){
    AuthData = {
      "AuthData.QQ.OpenId": OpenId
    }
    where = '{"AuthData.QQ.OpenId":"'+OpenId+'"}';
  } else if(AuthType == 'Weixin' && OpenId){
    if(jsonRequestBody.UnionId){
      let UnionId = jsonRequestBody.UnionId;
      AuthData ={
        "AuthData.Weixin.OpenId": OpenId,
        "AuthData.Weixin.UnionId": UnionId
      };
    } else {
      AuthData ={
        "AuthData.Weixin.OpenId": OpenId
      };
    }

    where = '{"AuthData.Weixin.OpenId":"'+OpenId+'"}';

  } else if(AuthType == 'Sina' && OpenId){
    AuthData = {
      "AuthData.Sina.OpenId": OpenId
    };
    where = '{"AuthData.Sina.OpenId":"'+OpenId+'"}';
  } else {
    result = {
      success: false,
      msg: 'e002: 验证没通过,请检查参数'
    }
    ctx.response.body = result
    return result;
  }
  let newUmeuser;
  newUmeuser = await Umeuser.find(AuthData).exec();
  if(newUmeuser && newUmeuser.length>0){
    newUmeuser.LoginTime = new Date();
    result = {
      success: true,
      msg: '验证通过',
      response: newUmeuser

    }
    console.log("该用户存在");
  } else {
    let token = await DroiBassUtils.getSessionToken();
    let BassUser = await DroiBassUtils.queryDroiObjects(token,'_User','',where);
    //let BassUser = await axios.get(Api);
    //console.info(BassUser)
    if(BassUser && BassUser.Result.length>0){
      newUmeuser = await importUsersParams(BassUser.Result[0])
      result = {
        success: true,
        msg: '验证通过',
        response: newUmeuser
      }
    } else{

      let newUser = new Umeuser({
        Coin:0,
        CoinFromApprentice:0,
        Balance:0,
        Sign:0
      });
      if(jsonRequestBody.Icon){
        newUmeuser.Icon = {
          url : jsonRequestBody.Icon
        };
      }
      if(AuthType == 'QQ'){
        newUser.AuthData = {
          QQ:{
            OpenId:OpenId
          }
        }
      } else if(AuthType == 'Weixin'){
        if(jsonRequestBody.UnionId){
          newUser.AuthData ={
            Weixin:{
              OpenId:OpenId,
              UnionId:UnionId
            }
          }
        } else {
          newUser.AuthData ={
            Weixin:{
              OpenId:OpenId
            }
          }
        }
      } else if(AuthType == 'Sina'){
        newUser.AuthData ={
          Sina:{
            OpenId:OpenId
          }
        }
      }
      newUmeuser = await newUser.save();
      result = {
        success: true,
        msg: '验证通过',
        response: newUmeuser
      }
      console.log('data', newUmeuser)
    }
  }
  ctx.response.body = result
  await next();
  return result
}

exports.loginByPhone = async (ctx, next) => {
  const jsonRequestBody =  ctx.request.body
  console.info(jsonRequestBody.PhoneNum)
  let PhoneNum  = jsonRequestBody.PhoneNum
  let VerifyCode = jsonRequestBody.VerifyCode;
  let result;

  /*校验手机号和验证码*/
  if (!PhoneNum || !VerifyCode) {
    result = {
      success: false,
      msg: 'e003: 验证没通过，手机号或验证码格式错误'
    }
    ctx.response.body = result
    return result;
  }

  let verifyCodeObj = await Code.findOne({
    PhoneNum: xss(_.trim(PhoneNum))
  }).exec();
  if(!verifyCodeObj || (verifyCodeObj.VerifyCode !== VerifyCode) ){
    result = {
      success: false,
      msg: 'e004:验证没通过,手机号或验证码不匹配'
    }
    ctx.response.body = result
    return result;
  }

  let isCodeVerifyByTime = sms.verifyCode(VerifyCode)
  console.info(isCodeVerifyByTime);
  if(isCodeVerifyByTime == false){
    result = {
      success: false,
      msg: 'e005:验证码失效了'
    }
    ctx.response.body = result
    return result;
  }

  let newUmeuser = await Umeuser.findOne({
    PhoneNum: xss(_.trim('86'+PhoneNum))
  }).exec();
  console.info(newUmeuser)
  if(newUmeuser){
    newUmeuser.PhoneNumVerified = true;
    newUmeuser.LoginTime = new Date();
    newUmeuser = await newUmeuser.save();
    console.info(newUmeuser._id)
    result = {
      success: true,
      msg: '验证通过',
      response: {
        _id: newUmeuser._id,
        token: await getSignJWT({
          _id: newUmeuser._id,
          PhoneNum:'86'+PhoneNum
        })
      }
    }
    console.log("该用户存在");

  } else {
    let token = await DroiBassUtils.getSessionToken();
    const where = '{"PhoneNum":"86'+PhoneNum+'"}';
    let BassUser = await DroiBassUtils.queryDroiObjects(token,'_User','',where);
    console.info(BassUser)
    if(BassUser && BassUser.Result.length>0){
      console.info(token);
      //console.info(BassUser.data.Result[0])
      newUmeuser = await importUsersParams(BassUser.Result[0])
      console.info(BassUser.Result[0].PhoneNum)
      result = {
        success: true,
        msg: '验证通过',
        response: {
          _id: newUmeuser._id,
          token: await getSignJWT({
            _id: newUmeuser._id,
            PhoneNum:'86'+PhoneNum
          })
        }
      }
      console.log("bass导入用户数据");
    } else {
      newUmeuser = new Umeuser({
        PhoneNum:xss(_.trim('86'+PhoneNum)),
        Coin:0,
        CoinFromApprentice:0,
        Balance:0,
        Sign:0,
        LoginTime:new Date()
      });
      newUmeuser = await newUmeuser.save();
      result = {
        success: true,
        msg: '验证通过',
        response: {
          _id: newUmeuser._id,
          token: await getSignJWT({
            _id: newUmeuser._id,
            PhoneNum:'86'+PhoneNum
          })
        }
      }
      console.log("新用户");
    }
  }
  ctx.response.body = result
  await next();
  return result
}

exports.getVerifyCode = async (ctx, next) => {
  const jsonRequestBody =  ctx.request.body
  let PhoneNum  = jsonRequestBody.PhoneNum
  console.info(PhoneNum)
  let newVerifyCodeObj = await Code.findOne({
    PhoneNum: xss(_.trim(PhoneNum))
  }).exec();
  let VerifyCode = sms.getCode();
  console.log(VerifyCode);
  if (!newVerifyCodeObj) { //新用户
    //查询bass数据 15921825642
    newVerifyCodeObj = new Code({
        PhoneNum: xss(_.trim(PhoneNum)),
        VerifyCode: xss(_.trim(VerifyCode)),
        CreateTime: new Date()
      })
    console.log('新手机号');
  } else {
    newVerifyCodeObj.VerifyCode = VerifyCode;
    newVerifyCodeObj.CreateTime = new Date();
    console.log('老手机号');
  }
  let result ={
    success: false,
    msg: '验证码发送失败'
  };

  try {
    await newVerifyCodeObj.save();
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


exports.deleteUmeuser = async (ctx, next) => {
  let val = null
  const data = await Umeuser.remove({_id: ctx.params.id})
  //console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  ctx.response.body = result
  return result
}
exports.updateUmeuser = async (ctx, next) => {
  const jsonRequestBody =  ctx.request.body
  console.info(jsonRequestBody.PhoneNum)
  const data = await Umeuser.updateOne(
    {_id: xss(_.trim(jsonRequestBody._id))},
    { $set: {
      "PhoneNum": xss(_.trim('86'+ jsonRequestBody.PhoneNum))
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

exports.getUmeuserInfoById = async (ctx, next) => {
  const jsonRequestBody =  ctx.request.body
  console.info(jsonRequestBody._id)
  const token = ctx.request.header.token
  let result;
  let verifyJWT = await verifySignJWT(token)
  console.info(verifyJWT._id)
  if(verifyJWT && (verifyJWT._id == jsonRequestBody._id) ){
    const data = await Umeuser.findOne({_id: jsonRequestBody._id})
    console.log('data', data)
    result = {
      code:200,
      response: data,
    }
  } else {
    result = {
      code:401,
      response: "token 验证失败！",
    }
  }
  ctx.response.body = result
  return result
}