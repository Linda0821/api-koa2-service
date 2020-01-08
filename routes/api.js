const Router = require('koa-router')

const setController = require('../controllers/setController');
const userController = require('../controllers/userController');
const studentController = require('../controllers/StudentController');
const UmeuserController = require('../controllers/UmeuserController');



module.exports = () => {
  const api = new Router()
  api.get('/users', userController.getUserList)
  api.get('/user/:id', userController.getUserInfoById)
  api.get('/user/delete/:id', userController.deleteUser)
  api.post('/user/update', userController.updateUser)
  api.post('/user/add', userController.addUser)
  api.get('/settings',setController.getSettings)
  api.get('/students', studentController.getStudentList)
  api.post('/student/phone/send', studentController.getVerifyCode)
  api.post('/student/phone/login', studentController.LoginByPhone)
  api.get('/student/delete/:id', studentController.deleteStudent)

  api.get('/ume/user/import',UmeuserController.importUserInfo)
  api.get('/ume/users',UmeuserController.getUmeuserList)
  api.post('/ume/user/info',UmeuserController.getUmeuserInfoById)
  api.get('/ume/user/delete/:id', UmeuserController.deleteUmeuser)
  api.post('/ume/user/update', UmeuserController.updateUmeuser)

  /*发送验证码*/
  api.post('/ume/user/phone/send',UmeuserController.getVerifyCode)
  /*手机登录注册*/
  api.post('/ume/user/phone/register',UmeuserController.loginByPhone)
  api.post('/ume/user/phone/login',UmeuserController.loginByPhone)
  /*第三方登录*/
  api.post('/ume/user/auth/login',UmeuserController.loginByAuth)

  return api;
}