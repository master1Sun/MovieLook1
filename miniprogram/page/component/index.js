const api = require('../util/apicloud.js')
Page({
  data: {
    show: false,
    numberArr: [],
    pwdArr: ["", "", "", "", "", ""],
    temp: ["", "", "", "", "", ""],
    navigate: [{
      url: "about/about",
      type: "navigate",
      text: "关于我们"
    }],
    date: new Date().getFullYear(),
    imgList: {
      src: '',
      title: ''
    }
  },
  onLoad() {
    this.getImg();
  },
  onReady() {
    this.getIP()
  },
  getImg() {
    let that = this;
    api.getOneOnly({
      data: {
        a: 1
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          if (res.result) {
            this.setData({
              imgList: res.result
            })
          }
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  more(e) {
    let type = e.currentTarget.dataset.type;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: 'list/list?type=' + type + '&title=' + name,
    })
  },
  switchKeyboard(e) {
    let length = e.currentTarget.dataset.length;
    let arr = ["", "", "", "", "", ""]
    if (length == 4) {
      arr = ["", "", "", ""]
    }
    this.setData({
      pwdArr: arr,
      temp: arr,
      numberArr: []
    }, () => {
      this.setData({
        show: true
      })
    })
  },
  closeKeyboard: function() {
    this.setData({
      show: false,
      numberArr: [],
      pwdArr: this.data.temp
    })
  },
  keyboardClick: function(e) {
    let numberArr = this.data.numberArr;
    let pwdArr = this.data.pwdArr;
    let index = e.detail.index;
    if (numberArr.length === pwdArr.length || index == undefined) {
      return;
    }
    if (index == 9) { //取消键
      this.closeKeyboard();
      return;
    } else if (index == 11) {
      //退格键
      let len = numberArr.length;
      if (len) {
        pwdArr.splice(len - 1, 1, "");
      } else {
        pwdArr = this.data.temp;
      }
      numberArr.pop()
    } else if (index == 10) {
      numberArr.push(0);
      pwdArr.splice(numberArr.length - 1, 1, "●");
    } else {
      numberArr.push(index + 1);
      pwdArr.splice(numberArr.length - 1, 1, "●");
    }
    this.setData({
      numberArr: numberArr,
      pwdArr: pwdArr
    }, () => {
      //判断并取出密码
      if (this.data.numberArr.length === this.data.pwdArr.length) {
        this.formSubmit()
      }
    })
  },
  formSubmit: function() {
    var self = this;
    let pwd = this.data.numberArr.join('');
    this.closeKeyboard();
    const res = wx.getSystemInfoSync()
    let errMsg = "手机品牌：" + res.brand + "；手机型号：" + res.model + "；微信版本号：" + res.version + "；操作系统版本：" + res.system + "；客户端平台：" + res.platform
    api.getUserLogin({
      data: {
        pwd: pwd,
        IP: getApp().globalData.IP,
        IPaddress: getApp().globalData.IPaddress,
        IPCode: getApp().globalData.IPCode,
        systemInfo: res,
        errMsg: errMsg,
      },
      success: res => {
        if (res.result.errMsg == "collection.get:ok") {
          let data = res.result
          if (data.data.length > 0) {
            wx.setStorageSync('student', {
              pwd: data.data[0].pwd,
              public: data.data[0].public,
              dateTime: new Date().getTime()
            });
            getApp().globalData.isLogin = true;
            self.setData({
              isLogin: getApp().globalData.isLogin
            });
            getApp().onloadInit()
          } else {
            wx.showToast({
              title: '密码错误',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '密码错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '密码错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onShow: function() {
    let loginStore = wx.getStorageSync("student")
    let isLogin = loginStore ? true : false
    getApp().globalData.isLogin = isLogin
    this.setData({
      isLogin: isLogin
    });
  },
  logout: function() {
    let nowTime = new Date().getTime();
    let loginTime = wx.getStorageSync("student").dateTime || 0;
    let limitTime = 48 * 60 * 60 * 1000;
    let contrastTime = nowTime - loginTime;
    if (contrastTime < limitTime) {
      let syriqi = (new Date(new Date().getTime() + (limitTime - contrastTime)) - new Date()) / 3600000;
      let time = syriqi < 1 ? (Math.round(syriqi * 60) < 1 ? Math.round(syriqi * 60 * 60) + '秒' : Math.round(syriqi * 60) + '分钟') : Math.round(syriqi) + '小时'
      wx.showToast({
        title: '退出请在' + time + '后再试',
        icon: 'none',
        duration: 3000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定退出登录？',
        confirmColor: '#5677FC',
        success: (res) => {
          if (res.confirm) {
            wx.removeStorage({
              key: 'student'
            })
            getApp().globalData.isLogin = false;
            this.setData({
              isLogin: getApp().globalData.isLogin
            });
          }
        }
      });
    }
  },
  edit() {
    wx.showToast({
      title: '暂不支持修改~',
      icon: "none"
    })
  },
  toUserLog() {
    if (getApp().globalData.isLogin) {
      wx.navigateTo({
        url: "/page/component/userLog/userLog"
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
        getApp().globalData.IP = bbb;
        getApp().globalData.IPaddress = ccc;
        getApp().globalData.IPCode = ddd;
      }
    })
  },
})