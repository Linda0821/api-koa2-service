'use strict'

const _ = require('lodash');
const axios = require('axios');

const API_LOGIN = "https://api.droibaas.com/rest/users/v2/login";
const API_USERS = "https://api.droibaas.com/rest/users/v2/";
const API_OBJECT = "https://api.droibaas.com/rest/objects/v2/";

const APPID = '6a8umbzh1B4K3nJEnXKRMJJdTjvqWzhhlQC6zJcL';//'yxbumbzhniv6tBaArTi9cMJhFe8HO7TElQAA8tUE';
const APIKEY = 'ymQTVoRxW_8Ups07qKVq8hBlRWHUGefxbBJsYbCDPJVvPI1jH4ObvSVZCQgGADaz';//'pS_DAzI39Nk8cERqGWn4IE7gao5nDnrpPLYUbuRbUJclV8ZbjO4NaD6yyu4Xr8En';
const ADMIN_UID = 'SuperAdmin2';//'SuperAdmin';
const ADMIN_PWD = '684775700007d5cb6fd30add625d1593cc093de157d20c7114ed4656625d1c13';//'f97a688d671de90ff316d75718621f9c6ba11141af17c5e433ccdc0125a9038a';

exports.getSessionToken = async () => {

    const config  =  {
        headers: {
            'Content-Type': 'application/json',
            'X-Droi-AppID': APPID,
            'X-Droi-Api-Key': APIKEY
        }
    };

    const postParams = {
        'UserId': ADMIN_UID,
        'Password': ADMIN_PWD,
        'Type': 'general'
    };

    let ret = await axios.post(API_LOGIN, postParams, config);
    if (!ret || !ret.data) {
        return null;
    }

    if (ret.data.Code !== 0 || !ret.data.Result) {
        return null;
    }
    return ret.data.Result['Token'];
}

exports.createDroiObject = async (sessionToken, objName, requestBody) => {

    if (!objName || !requestBody ||  _.isEmpty(sessionToken)) {
        return null;
    }

    const config  =  {
        headers: {
            'Content-Type': 'application/json',
            'X-Droi-AppID': APPID,
            'X-Droi-Api-Key': APIKEY,
            'X-Droi-Session-Token': sessionToken
        }
    };

    let requestUrl = API_OBJECT + objName;
    let ret = await axios.post(requestUrl, requestBody, config);
    console.log('DroiBaaSUtils.createDroiObject ret='+JSON.stringify(ret.data));
    if (!ret || !ret.data) {
        return null;
    }

    if (ret.data.Code !== 0 || !ret.data.Result) {
        return null;
    }

    return ret.data.Result['_Id'];
}

exports.updateDroiObject = async (sessionToken, objName, objId, requestBody) => {

    if (!objName || !requestBody || _.isEmpty(sessionToken) || _.isEmpty(objId)) {
        return false;
    }

    const config  =  {
        headers: {
            'Content-Type': 'application/json',
            'X-Droi-AppID': APPID,
            'X-Droi-Api-Key': APIKEY,
            'X-Droi-Session-Token': sessionToken
        }
    };

    let requestUrl = API_OBJECT + objName + '/' + objId;
    let ret = await axios.patch(requestUrl, requestBody, config);
    if (!ret || !ret.data) {
        return false;
    }

    if (ret.data.Code !== 0) {
        return false;
    }

    return true;
}

exports.queryDroiObjects = async (sessionToken, objName, objId, where, limit, offset, order, count) => {

    if (!objName || _.isEmpty(sessionToken) || _.isEmpty(objName)) {
        return null;
    }

    const config  =  {
        headers: {
            'Content-Type': 'application/json',
            'X-Droi-AppID': APPID,
            'X-Droi-Api-Key': APIKEY,
            'X-Droi-Session-Token': sessionToken
        }
    };

    let query = '';
    if (_.isEmpty(where) === false) {
        query = query + '&where='+where;
    }
    if (_.isEmpty(limit) === false) {
        query = query + '&limit='+limit;
    }
    if (_.isEmpty(offset) === false) {
        query = query + '&offset='+offset;
    }
    if (_.isEmpty(order) === false) {
        query = query + '&order='+order;
    }
    if (_.isEmpty(count) === false) {
        query = query + '&count=true';
    }

    let requestUrl = API_OBJECT + objName;
    if (_.isEmpty(query) === false) {
        requestUrl = requestUrl + '?' + query;
    }

    console.log('requestUrl='+requestUrl);
    console.log('config='+JSON.stringify(config));

    let ret;
    try {
        ret = await axios.get(requestUrl, config);
    } catch (err) {
        console.error('err='+err.stack || err);
        //ret = await axios.get(requestUrl, config);
    }

    if (!ret || !ret.data) {
        return null;
    }

    return ret.data;
}