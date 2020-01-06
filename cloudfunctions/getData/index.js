// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');
cloud.init()
const db = cloud.database();
/**
 * 获取网速测试工具小程序资源文件
 * 
 */

// 云函数入口函数
exports.main = async (event, context) => {
  let access_token = await db.collection("session_key").doc('session_key_id').get()
  return await invokecloudfunction(access_token.data.session_key, getDataType(event.NODEJS, event));
}



function getDataType(index, event) {
  if (index == 0) {//获取网速测试小程序用户与测试数量
    return {
      name: 'count',
      data: {
        a: 1
      }
    }
  } else if (index == 1) {//获取去网速测试小程序各种测试数据按类型获取
    return {
      name: 'rop',
      data: {
        status: event.status,
        g: event.g,
        f: event.f,
        city: event.city,
        count: event.count
      }
    }
  } else if (index == 2) {//获取网速测试小程序用户信息
    return {
      name: 'user',
      data: {
        status: event.status,
        k: event.k,
        openid: event.openid,
        city: event.city
      }
    }
  }
}


function invokecloudfunction(access_token, data) {
  const FUNCTION_NAME = data.name;
  const ENV = 'database';
  const INVOKE_CLOUD_FUNCTION_URL = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=${FUNCTION_NAME}`;
  return new Promise(function (resolve, reject) {
    request.post({
      url: INVOKE_CLOUD_FUNCTION_URL,
      json: data.data
    }, function (err, httpResponse, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  });
}





