// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');

cloud.init()
const db = cloud.database();




/**小程序关于列 */
let p_name = '风与蓝天';
let p_title = '尊敬的用户，您好，请仔细阅读以下内容：'; //介绍标题
let p_name1 = '本程序资源来源于互联网，所有资源问题与本程序无关，如发现有问题及时联系我。'; //介绍内容一
let p_name2 = '本程序内容来源于互联网，本程序不承担任何由于内容的合法性及健康性所引起的争议和法律责任。 欢迎大家对本程序内容侵犯版权等不合法和不健康行为进行监督和举报。'; //介绍内容二
let p_name3 = '本程序提供热门电影电视资源查看，如果在本程序中发现各种诱导信息请不要相信，及时与我联系。'; //介绍内容三
let p_name4 = '感谢大家支持，登录请打开客服中心发送“密码”，获取密码后登录即可。'; //介绍内容四
let p_name5 = '您可以通过下面邮箱联系我，或者小程序客服联系。'; //介绍内容五
let p_email = '邮箱:457358344@qq.com'; //邮箱
let p_src = 'cloud://atao.6174-atao-1258210999/微信图片_20191220110511.jpg'; //尾部图片
let p_footer = '觉得本程序可以的，点击查看图片，长按扫一扫，赞赏支持'; //尾部描述
/**小程序关于列结束 */

const playSource = true; //是否显示播放源
const music = {
  musicUrl: 'http://music.163.com/song/media/outer/url?id=32317208.mp3',
  musicTitle: '僕らの手には何もないけど',
  musicImgUrl: 'http://p2.music.126.net/V1o9XDhAnI1ayWW5elJwFQ==/109951163338252165.jpg?param=130y130',
}





// 云函数入口函数
exports.main = async(event, context) => {
  if (event.NODEJS == 2) { //返回关于小程序描述信息
    return await getDescribe(event);
  } else if (event.NODEJS == 3) { //用户登录验证
    return await getUserLogin(event)
  } else if (event.NODEJS == 4) { //返回是否显示播放源
    return getsystemInit(event);
  } else if (event.NODEJS == 5) { //获取登录密码
    return await getLoginPwd();
  } else if (event.NODEJS == 6) { //记录播放的电影记录
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
  const wxContext = cloud.getWXContext()
  let time = new Date()
  time.setHours(time.getHours() + 8);
  let ft = formatTimeDay(time);
  await db.collection('lookCount').add({
    data: {
      _openid: wxContext.OPENID,
      createTime: ft,
      systemInfo: event.systemInfo
    }
  })

  let ll_data = await db.collection('loginLog').where({
    _openid: wxContext.OPENID
  }).get()
  return ll_data.data[0].public || false;
}


//返回登录密码
async function getLoginPwd() {
  let time = new Date()
  time.setHours(time.getHours() + 8);
  let ft = formatTimeDay(time);
  let rd = Math.floor((Math.random() * 9 + 1) * 100000);
  let public = Math.floor(Math.random() * 10) == 0 ? true : false
  let data = await db.collection("user").where({
    isUse: true
  }).get()
  if (data.data.length <= 0) {
    await db.collection("user").add({
      data: {
        public: public,
        pwd: rd,
        isUse: true,
        _openid: cloud.getWXContext().OPENID,
        createtime: ft
      }
    })
  } else {
    let bj = Math.floor(Math.random() * data.data.length)
    rd = data.data[bj].pwd
  }
  return rd;
}

//返回关于小程序描述信息
async function getDescribe(event) {
  let rd = await getLoginPwd()
  let p_name6 = '当前登录密码：' + rd;
  return {
    p_title,
    p_name1,
    p_name2,
    p_name3,
    p_name4,
    p_name5,
    p_name6,
    p_email,
    p_src,
    p_footer
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
      let data = await db.collection('playhistory').where({
        name: event.list.title
      }).get()
      if (data.data.length <= 0) {
        return await db.collection('playhistory').add({
          data: {
            create_openid: wxContext.OPENID,
            createtime: ft,
            list: event.list,
            name: event.list.title,
            link: event.link,
            count: 1
          }
        })
      } else {
        return await db.collection('playhistory').where({
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
    return await db.collection('playhistory').field({
      count: true,
      name: true,
      updatetime: true,
      link: true
    }).limit(limit).orderBy('count', 'desc').get()
  } else if (event.status == 2) { //删除
    return await db.collection('playhistory').remove()
  }
}

//获取用户登录信息
async function getUserLogin(event) {
  let time = new Date()
  time.setHours(time.getHours() + 8);
  let ft = formatTimeDay(time);
  const wxContext = cloud.getWXContext()
  let list = {
    _openid: wxContext.OPENID,
    pwd: Number(event.pwd),
    systemInfo: event.systemInfo,
    IP: event.IP || '',
    IPaddress: event.IPaddress || '',
    IPCode: event.IPCode || '',
    errMsg: event.errMsg,
    public: false,
    loginCount: 1,
    createtime: '',
    updatetime: ''
  }
  let data = await db.collection("user").where({
    pwd: Number(event.pwd),
    isUse: true
  }).get()
  if (data.data[0].pwd) {
    await db.collection("user").where({
      pwd: Number(event.pwd),
      isUse: true
    }).update({
      data: {
        isUse: false,
        updatetime: ft
      }
    })
    if (data.data[0].public) {
      list.public = true
    } else {
      list.public = false
    }
    let p = await db.collection("loginLog").where({
      _openid: wxContext.OPENID
    }).get()
    if (p.data.length <= 0) {
      list.createtime = ft;
      await db.collection("loginLog").add({
        data: list
      })
    } else {
      list.loginCount = p.data[0].loginCount + 1;
      list.updatetime = ft;
      await db.collection("loginLog").where({
        _openid: wxContext.OPENID,
      }).update({
        data: list
      })
    }
  }
  return data
}


/**其他通用接口 */

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

//天气获取资源接口
function getWeather(code) {
  const url = 'https://restapi.amap.com/v3/weather/weatherInfo?city=' + code + '&key=5e287897a4d3bd6e8c7f1d61794a12f5&output=JSON&extensions=base'
  return new Promise(function(resolve, reject) {
    request.get({
      url: url,
    }, function(err, httpResponse, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  });
}