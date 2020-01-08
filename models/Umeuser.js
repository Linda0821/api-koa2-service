const mongoose = require('mongoose');

// 账户的数据库模型
/** Class representing a specific User model. 用戶
 *
 * @property {string}  Nickname      - 暱稱
 * @property {string}  Gender   - 性別
 * @property {string}  Job  - 職業
 * @property {string}  Education - 教育逞度
 * @property {string}  InviteCode  - 邀請碼
 * @property {string}  ActivateStatus   - 啟用狀態
 * @property {string}  AwakeStatus  - 喚醒狀態
 * @property {number}  Age - 年齡
 * @property {number}  Coin   - 金幣總額
 * @property {number}  CoinFromApprentice  -徒弟貢獻的金幣總額
 * @property {number}  Balance - 錢幣總額
 * @property {number}  ExchangeRate - 匯率
 * @property {number}  Sign   - 簽到次數
 * @property {Date}    LastLoginTime  - 上次登錄時間
 * @property {DroiBaaS.DroiFile}  Icon - 用戶圖像
 * @property {number}  Prev_user_id - 舊版id
 * @property {string}  Prev_user_token  - 非空且唯一，用户唯一ID，注册成功后下发客户端
 * @property {boolean} Prev_need_bm_syn  - 书签同步标识位（1=需要同步）
 * @property {number}  Bm_version  - 舊版本號
 */
let UmeuserSchema = new mongoose.Schema({
  Uid:{type: String, index: { unique: true }},//1
  _CreationTime:Date,//2
  _ModifiedTime:Date,//3
  UserId:String,//4
  Enabled:Boolean,//5
  PhoneNum:String,//6
  PhoneNumVerified:Boolean,//7
  PhonePinCode:String,//8
  PhoneHasTried:Number,//9
  EmailToken:String,//10
  Email:String,//11
  EmailVerified:Boolean,//12
  EmailHasTried:Number,//13
  CurrentOTP:String,//14
  Nickname:String,//15
  Gender:String,//16
  Job:String,//17
  Education:String,//18
  InviteCode:String,//19
  ActivateStatus:String,//20
  AwakeStatus:String,//21
  Age:Number,//22
  Coin:Number,//23
  CoinFromApprentice:Number,//24
  Balance:Number,//25
  ExchangeRate:Number,//26
  Sign:Number,//27
  LastLoginTime:Date,//28
  Bm_version:Number,//29
  Prev_user_id:Number,//30
  Prev_need_bm_syn:Boolean,//31
  Prev_user_token:String,//32
  Icon:Object,//33
  AuthData:Object, //34
  LoginTime:Date //35
});
let Umeuser = mongoose.model('Umeuser',UmeuserSchema)

module.exports = Umeuser;
