const Router = require('koa-router')

const home = require('./home')();
const page = require('./page')();
const api = require('./api')();

module.exports = () => {
  // 装载所有子路由
  let router = new Router()
  router.use('/', home.routes(), home.allowedMethods())
  router.use('/page', page.routes(), page.allowedMethods())
  router.use('/api', api.routes(), api.allowedMethods())
  return router;
}
