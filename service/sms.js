'use strict'

const http = require('http')
const Promise = require('bluebird')

/**
 *  speakeasy 验证码生成器
 **/
const speakeasy = require('speakeasy')

exports.getCode = () =>{
  const code = speakeasy.totp({
    secret: 'xjsapp',
    digits: 6
  })

  return code
}

exports.verifyCode = (code) =>{
  //console.info(code);
  const tokenValidates = speakeasy.totp.verify({
    secret: 'xjsapp',
    token: code,
    digits: 6
  });
  console.info(tokenValidates);
  return tokenValidates
}

exports.send = function(number, code) {
  return new Promise(function(resolve, reject) {
    if (!number || !code) {
      return reject(new Error('手机或验证码参数有误！'))
    }

    var postData = {
      "account":"YZM3661144",
      "password":"7fZFnM1lw38c3b",
      "msg": '【微米浏览器】您本次操作的验证码为 '+ code +'，如非本人操作请忽略此短信。',
      "phone": number,
      // "sendtime": "" // 可不传，定时发送时间的时间戳
      // "report": flase, // 可不传，是否需要状态报告，默认false；如需状态报告则传”true”
      // "extend": 253, // 可不传，下发短信号码扩展码,建议1-3位
      // "uid": "2018abc" // 可不传，该条短信在您业务系统内的ID，如订单号或者短信发送记录流水号
    }

    let params = JSON.stringify(postData);
    let options = {
      protocol: "http:", // 创蓝所有接口支持https和http协议，建议https
      hostname: "smssh1.253.com",
      port: 80,
      path: '/msg/send/json',
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      }
    };
    const req = http.request(options, res => {
      console.log(`状态码: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`返回参数: ${chunk}`);
        const JsonRes = JSON.parse(chunk)
        console.info(JsonRes.code);
        if(JsonRes.code == '0'){
          return resolve();
        }else {
          return reject(new Error(`返回参数: ${chunk}`))
        }
      });
    });
    req.write(params);
    req.end();
  })
}