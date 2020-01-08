const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router')

const newsController = require('./controllers/newsController');


const app = new Koa()

app.use(bodyParser())


let home = new Router()
home.get('/', async ( ctx )=>{
  let html = `
      <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
      <li><a href="/api/users">/api/user</a></li>
      <li><a href="/api/settings">/api/settings</a></li>
    </ul>
    `
  ctx.body = html
})
home.get('/api/import', newsController.getNewsList)
home.get('/api/user', newsController.getUserInfo)


app.use(home.routes()).use(home.allowedMethods())



/*启动服务器*/
app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000')
})