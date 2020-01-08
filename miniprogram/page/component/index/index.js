const api = require('../../util/apicloud.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    "data": new Date().getFullYear(),
    "year": 0,
    "month": 0,
    "day": 0,
    "week": 0,
    "desc": '',
    "comment": '',
    "directors": '',
    "title": '',
    "average": '',
    "rating_nums": '',
    "stars": '',
    "loading_opacity": 1,
    "animationData": '',
    "image": '',
    "IP": '',
    "IPaddress": '',
    "IPCode": ''
  },
  //页面初次渲染完成
  onReady: function(e) {
    this.showDate();
    var _this = this,
      todayDate = this.data.year + '' + this.data.month + '' + this.data.day;
    wx.getStorage({
      key: 'movie',
      success: function(res) {
        // console.log(res.data)
        if (res.data.date == todayDate) {
          _this.setData(res.data.movieData);
          _this.loading();
        } else {
          _this.loadMovie();
        }
      },
      fail: function() {
        _this.loadMovie();
      }
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.loadMovie();
    this.getIP()
    wx.stopPullDownRefresh()
  },
  // 页面初始化
  onLoad: function(options) {
    this.getIP()
  },
  //显示日期，年月日
  showDate: function() {
    var today = new Date(),
      _this = this,
      year = today.getFullYear() + '',
      i = 0,
      chineseYear = '',
      week = today.getDay();
    //将年份转换为中文
    do {
      chineseYear = chineseYear + app.chineseDate.years[year.charAt(i)]
      i++;
    } while (i < year.length)
    //设置数据
    _this.setData({
      "year": chineseYear,
      "month": app.chineseDate.months[today.getMonth()],
      "day": today.getDate(),
      "week": app.chineseDate.years[week]
    })
  },
  //加载top250电影信息
  loadMovie: function() {
    var _this = this;
    api.getOneOnly({
      data: {
        a: 1
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          if (res.result) {
            var now = new Date(),
              thisYear = now.getFullYear();
            var date = _this.data.year + '' + _this.data.month + '' + _this.data.day,
              renderData = {
                "image": res.result.src,
                "desc": res.result.pdb.desc,
                "comment": res.result.title,
                "directors": res.result.pdb.pl,
                "title": res.result.pdb.title,
                "average": res.result.pdb.image,
                "rating_nums": res.result.pdb.rating_nums,
                "stars": _this.starCount(res.result.pdb.rating_nums),
                "loading_opacity": 0
              };
            _this.setData(renderData);
            _this.storeData(date, renderData);
            _this.loading();
          }
        }
      }
    })
  },
  //计算行星显示规则
  starCount: function(originStars) {
    //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
    var starNum = originStars / 2,
      stars = [],
      i = 0;
    do {
      if (starNum >= 1) {
        stars[i] = 'full';
      } else if (starNum >= 0.1) {
        stars[i] = 'half';
      } else {
        stars[i] = 'no';
      }
      starNum--;
      i++;
    } while (i < 5)
    return stars;
  },
  //加载动画
  loading: function() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease"
    })
    animation.opacity(1).step()
    this.setData({
      animationData: animation.export()
    })
  },
  //将数据进行本地存储
  storeData: function(date, movieData) {
    wx.setStorage({
      key: "movie",
      data: {
        date: date,
        movieData: movieData
      }
    })
  },
  toCateGory() {
    if (getApp().globalData.playSource) {
      wx.navigateTo({
        url: '/page/component/category/category'
      })
    }
  },
  getIP() {
    var that = this;
    wx.request({
      url: 'https://pv.sohu.com/cityjson?ie=utf-8',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(e) {
        var aaa = e.data.split(' ');
        var bbb = aaa[4].replace('"', '').replace('"', '').replace(',', '')
        var ccc = aaa[8].replace('"', '').replace('"', '').replace(',', '').replace('};', '')
        var ddd = aaa[6].replace('"', '').replace('"', '').replace(',', '').replace('};', '')
        that.setData({
          IP: bbb,
          IPaddress: ccc,
          IPCode: ddd
        })
      }
    })
  },
})