const Koa = require('koa')
const fs = require('fs')
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

const app = new Koa()

app.use(bodyParser())


const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect("mongodb://localhost/test_ume",dbOptions).then(
  () => {console.info('MongoDB is ready');},
  err => {console.error('connect error:', err);}
);


/*
*加载路由中间件
*/
const router = require('./routes/router')();
app.use(router.routes()).use(router.allowedMethods())

/*启动服务器*/
app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000')
})