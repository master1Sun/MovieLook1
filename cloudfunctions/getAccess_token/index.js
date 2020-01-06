// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  let res = await getSession_key();
  let resData = JSON.parse(res);
  let access_token = resData.access_token;
  let ft = formatTimeDay(new Date());
  return await db.collection("session_key").doc('session_key_id').update({
    data: {
      session_key: access_token,
      updateTiem: ft
    },
    success(res) {
      return res;
    }
  })
}

async function getSession_key() {
  return await rp({
    method: 'get',
    url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx89d275c9d52ff3de&secret=148e6076d1d5023d8269e6a2c3e87a0c",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function(res) {
      return res;
    }
  })
}

const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}