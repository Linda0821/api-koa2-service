const http = require('https');
const axios = require('axios');
const xml2js = require('xml2js');

const xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : false})
const weaoo_api= 'https://www.funshipin.com/api/v1/openxml?channel=qiju100&page=1&cate_id=1&sign=4ubgfki0'

const getApi = async () => {
  var data_json = null;
  /*const news = await http.get(api, function (res) {
    let data = '';
    res.on('data', function (stream) {
      data += stream;
    });
    res.on('end', function () {
      console.info(typeof data)
      data_json = phaseXml(data)
      //console.info(data_json)
    });
  });*/
  let search_ret;
  try {
    search_ret = await axios.post(weaoo_api);
    //console.info(search_ret.data)
    data_json = phaseXml(search_ret.data)
  } catch (err) {
    console.log(err);
  }
  console.info(data_json)
  return data_json

}
const phaseXml = (data) => {
  let strings = ''
  xmlParser.parseString(data, function (error, result) {
    if (error === null) {
      strings = result.rss.channel.item
      //console.log(strings);
      for(let i in strings){
        console.log(strings[i])
        const urlReg = /(http|https):\/\/.*?(gif|png|jpg)/gi;
        const imgs = strings[i].description.match(urlReg);
        console.log("img: "+imgs[0]);    //["a=1", "b=2", "c=3"]
        strings[i].cover_url = imgs.join(";");
      }
    }
    else {
      console.log(error);
    }
  });
  return strings
}

exports.getNewsList = async (ctx, next) => {
  let news  = await getApi()
  let result = {
    success: true,
    response: news,
  }
  ctx.response.body = result
  await next();
  return result
}
exports.getUserInfo = async (ctx, next) =>{
  const api= 'http://browser.umeweb.com/cn_ume_api/droi/api/obj?class=_User&where={%22$and%22:[{%22AuthData.Weixin.OpenId%22:%22ol8ZJw4odaIWEDpCBwYOqXD4rXfM%22}]}'
  let user = await axios.get(api);
  //console.info(user.data.Result[0])
  let data = user.data.Result[0]
  for(let i in data){
    console.info(i+"======"+data[i])
  }
  ctx.response.body = data
  await next();
  return data
}