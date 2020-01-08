'use strict';

const crypto = require('crypto');

const AES_SECRET = '12e87e58475793133d5bb40c3ae76ca3';
const AES_IV = 'udv93xitfeu6xg8q';

const TAOBAO_SECRET_KEY = 'd34682618b6503641566ae83d971d35d';

exports.getSettings = async (ctx, next) => {

  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_SECRET), Buffer.from(AES_IV));
  let encrypted = cipher.update(TAOBAO_SECRET_KEY);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  ctx.status = 200;
  ctx.body = {
    success: true,
    msg: '',
    settings: {
      app_key: '27985254',
      secret: encrypted.toString('hex'),
      api:[
        {
          method: 'taobao.tbk.dg.material.optional',
          adzone_id: 'mm_124732562_33032153_109589700162',
          desc: '物料搜索'
        },
        {
          method: 'taobao.tbk.dg.optimus.material',
          adzone_id: 'mm_124732562_33032153_109589750184',
          desc: '物料精选'
        }
      ]
    }
  };
  return;
}