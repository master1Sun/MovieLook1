// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const playSource = true;

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.NODEJS == 0) { //用户登录和系统配置信息
    return await getsystemInit(event);
  } else if (event.NODEJS == 1) { //记录播放的电影记录
    return await getplayHistory(event);
  }
}


//返回是否显示播放源和用户高级权限
async function getsystemInit(event) {
  let public = await getLookCount(event);
  return {
    playSource,
    public
  };
}

//访问小程序次数统计
async function getLookCount(event) {
  let time = new Date()
  time.setHours(time.getHours() + 8);
  let ft = formatTimeDay(time);
  const wxContext = cloud.getWXContext()
  let public = Math.floor(Math.random() * 10) == 0 ? true : false
  let list = {
    _openid: wxContext.OPENID,
    systemInfo: event.systemInfo,
    loginCount: 1,
    updatetime: ''
  }
  let p = await db.collection("UserLogin").where({
    _openid: wxContext.OPENID
  }).get()
  if (p.data.length <= 0) {
    list.createtime = ft;
    list.public = public;
    await db.collection("UserLogin").add({
      data: list
    })
    return public;
  } else {
    list.loginCount = p.data[0].loginCount + 1;
    list.updatetime = ft;
    await db.collection("UserLogin").where({
      _openid: wxContext.OPENID,
    }).update({
      data: list
    })
    return p.data[0].public;
  }
}




//记录播放的电影
async function getplayHistory(event) {
  const wxContext = cloud.getWXContext()
  let time = new Date()
  time.setHours(time.getHours() + 8);
  let ft = formatTimeDay(time);
  if (event.status == 0) { //添加与更新
    if (event.list) {
      let data = await db.collection('PlayHistory').where({
        name: event.list.title
      }).get()
      if (data.data.length <= 0) {
        return await db.collection('PlayHistory').add({
          data: {
            create_openid: wxContext.OPENID,
            createtime: ft,
            updatetime: ft,
            list: event.list,
            name: event.list.title,
            link: event.link,
            count: 1
          }
        })
      } else {
        return await db.collection('PlayHistory').where({
          name: event.list.title
        }).update({
          data: {
            update_openid: wxContext.OPENID,
            updatetime: ft,
            list: event.list,
            link: event.link,
            count: Number(data.data[0].count) + 1
          }
        })
      }
    }
  } else if (event.status == 1) { //读取
    const limit = 100;
    return await db.collection('PlayHistory').field({
      count: true,
      name: true,
      updatetime: true,
      link: true
    }).limit(limit).orderBy('count', 'desc').get()
  }
}


//生成日期格式
const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}