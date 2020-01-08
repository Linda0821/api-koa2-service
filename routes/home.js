const Router = require('koa-router')

module.exports = () => {

  let home = new Router()
  // 子路由1
  home.get('/', async ( ctx )=>{
    let html = `
      <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
      <li><a href="/api/settings">/api/settings</a></li>
    </ul>
    `
    ctx.body = html
  })

  return home;
}