// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require("cheerio");
const request = require('superagent');
const Promise = require('bluebird');
cloud.init()

const httpUrls = [
  "https://www.133kp.com",
  "https://www.993kp.com",
  "https://www.116kp.com",
  "https://www.118kp.com",
  "https://www.117kp.com"
]
const pppUrl = "https://www.133kp.com" //httpUrls[Math.floor(Math.random() * httpUrls.length - 1)]
/**
 *小程序电影抓包主文件入口 
 *根据参数获取每个方法 
 */


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.NODEJS == 0) { //主页面信息
    return await getIndexDataHotData(event);
  } else if (event.NODEJS == 1) { //电影类型页面信息
    return await getTypeData(event);
  } else if (event.NODEJS == 2) { //电影详细信息
    return await getDataInfo(event);
  } else if (event.NODEJS == 3) { //电影播放源信息
    return await getPlayDataInfo(event);
  } else if (event.NODEJS == 4) { //搜索电影信息
    return await getSearchDataInfo(event);
  } else if (event.NODEJS == 5) { //每日一文
    return await getOneOnly();
  }
}


//每日一文获取
async function getOneOnly() {
  let page = await getPage('http://www.wufazhuce.com/');
  let $ = cheerio.load(page.text);
  let plist = [];
  let dateTime = new Date();
  $('.carousel-inner').children().each(function(index, element) {
    const el = $(element);
    let src = el.find('a').find('img').attr('src'),
      title = el.find('div[class="fp-one-cita-wrapper"]').find('div[class="fp-one-cita"]').find('a').text(),
      year = el.find('div[class="fp-one-cita-wrapper"]').find('div[class="fp-one-titulo-pubdate"]').find('p[class="may"]').text(),
      day = el.find('div[class="fp-one-cita-wrapper"]').find('div[class="fp-one-titulo-pubdate"]').find('p[class="dom"]').text();
    plist.push({
      src,
      title: title,
      year: dateTime.getFullYear() + '年 ' + (dateTime.getMonth() + 1) + '月',
      day: dateTime.getDate() + '日'
    })
  })
  return plist[0]
}


//获取搜索资源的详细信息
async function getSearchDataInfo(event) {
  let dlist = [];
  try {
    let page = await getPage(pppUrl + '/index.php?m=vod-search&wd=' + encodeURI(event.name));
    let $ = cheerio.load(page.text);
    getSearchResult($, dlist)
    let numberString = $('.row').find("div[class='hy-video-head']").find('h4[class="margin-0"]').find('span[class="text-color"]').text().split('”“')[1].replace("”", "")
    let number = Number(numberString);
    let count = Math.round(number / 10)
    if (count > 10) {
      count = 10
    }
    for (let i = 2; i <= count; i++) {
      await sleep(50);
      let page1 = await getPage(pppUrl + '/vod-search-pg-' + i + '-wd-' + encodeURI(event.name) + '.html');
      let $1 = cheerio.load(page1.text);
      getSearchResult($1, dlist)
    }
  } catch (err) {
    //出错拉
  } finally {
    return JSON.stringify(dlist)
  }
}



//循环获取资源下一页数量
function getSearchResult($, dlist) {
  $('.row').find("div").find('div').find('div[class="item clearfix"]').each(function(index, element) {
    const el = $(element);
    let link = el.find('.content').find('dt').find("a[class='videopic']").attr("href"),
      title = el.find('.content').find('dd').find('div[class="head"]').find("a").text(),
      image = el.find('.content').find('dt').find("a[class='videopic']").attr('style'),
      newDesc = el.find('.content').find('dt').find("a[class='videopic']").find("span[class='note textbg']").text();
    let re = /\([^\)]+\)/g
    image = image.match(re)[0];
    image = image.substring(1, image.length - 1);
    dlist.push({
      title: title,
      link: pppUrl + link,
      image: image,
      newDesc: newDesc
    })
  })
}




//获取电影信息的播放源地址
async function getPlayDataInfo(event) {
  let page = await getPage(event.url);
  let $ = cheerio.load(page.text);
  let sh = $(".item").find('div[class="info clearfix"]').find('script').html()
  let conent = sh.split(",")
  let play_sh = conent[6]
  let re = /\([^\)]+\)/g
  play_sh = play_sh.match(re)[0];
  play_sh = play_sh.substring(1, play_sh.length - 1);
  let bh_url = unescape(play_sh).replace("'", "").replace("'", "");
  let bh_name = conent[2].split('=')[1].replace("'", "").replace("'", "")
  let bh_from = conent[3].split('=')[1].replace("'", "").replace("'", "")
  let bh_server = conent[4].split('=')[1].replace("'", "").replace("'", "")
  let bh_note = conent[5].split('=')[1].replace("'", "").replace("'", "")
  let Data = {
    'from': bh_from.split('$$$'),
    'server': bh_server.split('$$$'),
    'note': bh_note.split('$$$'),
    'url': bh_url.split('$$$')
  }
  let mlist = [];
  for (i = 0; i < Data.from.length; i++) {
    let from = Data.from[i];
    url = Data.url[i];
    if (url.charAt(url.length - 1) == "#") {
      url = url.substring(0, url.length - 1);
    }
    urlarr = url.split('#');
    let plist = [];
    for (j = 0; j < urlarr.length; j++) {
      urlinfo = urlarr[j].split('$');
      name = '';
      url = '';
      if (urlinfo.length > 1) {
        name = urlinfo[0].replace("'", "").replace("'", "");
        url = urlinfo[1];
      } else {
        name = "第" + (j + 1) + "集";
        url = urlinfo[0]
      }
      plist.push({
        fromname: from,
        count: i,
        name: name,
        href: url
      })
    }
    mlist.push({
      fromname: from,
      list: plist
    })
  }
  return JSON.stringify(mlist);
}

//获取主页轮播图数据和热门资源数据
async function getIndexDataHotData() {
  let dlist = [];
  let page1 = await getPage(pppUrl + '/label-top.html');
  let _$ = cheerio.load(page1.text);
  _$('.tab-content').find('div[class="item"]').find('div').each(function(index, element) {
    const el = _$(element);
    let link = el.find("a").attr("href"),
      title = el.find("a").attr('title'),
      image = el.find("a").attr('data-original'),
      newDesc = el.find("span[class='score']").text();
    if (title && image && link) {
      dlist.push({
        title: title,
        link: pppUrl + link,
        image: image,
        newDesc: newDesc
      })
    }
  });
  return JSON.stringify(dlist)
}

//根据名称获取详细电影电视信息
async function getDataInfo(event) {
  let page = await getPage(event.url || pppUrl + '/vod-detail-id-97486.html');
  let $ = cheerio.load(page.text);
  let dlist = [];
  let link = $(".content").find("a[class='videopic']").attr("href")
  let title = $(".content").find("a[class='videopic']").attr("title")
  let newDesc = $(".content").find("a[class='videopic']").find('span[class="note textbg"]').text()
  let desc = $(".plot").text()
  let image = $(".content").find("a[class='videopic']").attr('style');
  let re = /\([^\)]+\)/g
  image = image.match(re)[0];
  image = image.substring(1, image.length - 1);
  let infoList = []; //电影演员详情集合
  $(".content").find("dd[class='clearfix']").find('ul').find('li').each(function(index, element) {
    const el = $(element);
    infoList.push(el.text())
  })
  let iqi_show = [{
    en_name: "letv",
    ch_name: "乐视"
  }, {
    en_name: "mgtv",
    ch_name: "芒果"
  }, {
    en_name: "sohu",
    ch_name: "搜狐"
  }, {
    en_name: "pptv",
    ch_name: "PPTV"
  }, {
    en_name: "youku",
    ch_name: "优酷"
  }, {
    en_name: "qq",
    ch_name: "腾讯"
  }, {
    en_name: "iqiyi",
    ch_name: "爱奇艺"
  }, {
    en_name: "acfun",
    ch_name: "七七云播"
  }, {
    en_name: "qqyun",
    ch_name: "琪琪云播"
  }, {
    en_name: "okyun",
    ch_name: "小新云播"
  }, {
    en_name: "bcyun",
    ch_name: "白菜云播"
  }, {
    en_name: "bili",
    ch_name: "哔哩视频"
  }, {
    en_name: "bdyun",
    ch_name: "八度云播"
  }, {
    en_name: "fnyun",
    ch_name: "蜂鸟云播"
  }, {
    en_name: "pan",
    ch_name: "百度网盘"
  }, {
    en_name: "kuyun",
    ch_name: "酷安云播"
  }, {
    en_name: "yjyun",
    ch_name: "百度云播"
  }, {
    en_name: "zdyun",
    ch_name: "迅雷云播"
  }, {
    en_name: "webplay",
    ch_name: "maccmsc.com"
  }];

  var alis = [];
  $("#playlist").find("div[class='panel clearfix']").each(function(index, element) {
    const el = $(element);
    let numTitle = el.find("a").attr("title");
    let en_numTitle;
    iqi_show.forEach(function(v) {
      if (v.ch_name == numTitle) {
        en_numTitle = v.en_name
      }
    })
    let blis = [];
    el.find("div").find("ul").find('li').each(function(index, element) {
      const elo = $(element);
      let numOtherTitle = elo.find("a").attr("title");
      let numOtherHref = elo.find("a").attr("href");
      blis.push({
        index: index,
        title: numOtherTitle,
        href: pppUrl + numOtherHref
      })
    })
    alis.push({
      index: index,
      title: numTitle,
      en_title: en_numTitle,
      list: blis
    })
  })

  await sleep(500)
  let playsource = await getPlayDataInfo({
    url: pppUrl + link,
    num: alis.length
  })

  dlist.push({
    title: title,
    link: pppUrl + link,
    desc: '详情介绍：\n' + desc,
    alis: alis,
    infoList: infoList,
    image: image,
    playsource: JSON.parse(playsource),
    newDesc: newDesc
  })
  return JSON.stringify(dlist)
}


//根据各类型获取数据
async function getTypeData(event) {
  const dic3 = {
    'm': 1,
    't': 2,
    'z': 4,
    'd': 3
  } //m:电影  t：电视剧 //z:综艺 d: 动漫
  let url = pppUrl + '/vod-list-id-' + dic3[event.type || "m"] + '-pg-' + (event.page || 1) + '-order--by-hits-class-0-year-0-letter--area--lang-.html'
  let page = await getPage(url);
  let $ = cheerio.load(page.text);
  let dlist = [];
  $('.hy-video-list').find("ul[class='clearfix']").find('li').each(function(index, element) {
    const el = $(element);
    let link = el.find("a").attr("href"),
      title = el.find("a").attr('title'),
      image = el.find("a").attr('data-original'),
      newDesc = el.find("span[class='score']").text();
    dlist.push({
      title: title,
      link: pppUrl + link,
      image: image,
      newDesc: newDesc
    })
  });
  return JSON.stringify(dlist)
}


function getPage(url) {
  return new Promise(function(resolve, reject) {
    request.get(url).end(function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}


async function sleep(time = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}