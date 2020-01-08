const Router = require('koa-router')
module.exports = () => {
  let page = new Router()
  page.get('/404', async ( ctx )=>{
    ctx.body = '404 page!'
  })
  page.get('/helloworld', async ( ctx )=>{
    ctx.body = 'helloworld page!'
  })

  return page;
}