const User = require('../models/User');
const _ = require('loadsh');
const xss = require('xss');

exports.getUserList = async (ctx, next) => {
  let val = null
  const data = await User.find()
  console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  //console.info(ctx)
  ctx.response.body = result
  return result
}
exports.addUser = async (ctx, next) => {
  let val = null
  const jsonRequestBody =  ctx.request.body
  console.info(jsonRequestBody.username)
  let newUser = new User({
    username: xss(_.trim(jsonRequestBody.username)),
    password: xss(_.trim(jsonRequestBody.password)),
    email: xss(_.trim(jsonRequestBody.email))
  });
  let data = await newUser.save();
  console.log('data', data)
  const result = {
    code:200,
    response: data,
    ts: 12345
  }
  ctx.response.body = result
  return result
}
exports.deleteUser = async (ctx, next) => {
  let val = null
  const data = await User.remove({_id: ctx.params.id})
  //console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  ctx.response.body = result
  return result
}
exports.updateUser = async (ctx, next) => {
  let val = null
  const jsonRequestBody =  ctx.request.body
  console.info(jsonRequestBody.username)
  const data = await User.updateOne(
    {_id: xss(_.trim(jsonRequestBody._id))},
    { $set: {
      "username": xss(_.trim(jsonRequestBody.username)),
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

exports.getUserInfoById = async (ctx, next) => {
  let val = null
  console.log(ctx.params.id);
  const data = await User.findOne({_id: ctx.params.id})
  console.log('data', data)
  const result = {
    code:200,
    response: data,
  }
  ctx.response.body = result
  return result
}