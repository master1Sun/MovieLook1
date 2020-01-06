const api = require('../../util/apicloud.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alis: [],
    playsource: [],
    desc: '',
    name: '',
    infoList: [],
    productList: [],
    _num: '1.0',
    curIndex: 0,
    isLogin: false,
    value: '',
    button3: [{
      text: "现在登录",
      type: 'red'
    }],
    modal9: false,
    options: null,
    en: '', //播放源的英文标签
    link: '',
  },
  bindTap(e) {
    let en = e.currentTarget.dataset.en
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index,
      en: en
    })
  },
  rate(e) {
    wx.vibrateShort() //短暂震动
    let rate = e.currentTarget.dataset.rate;
    this.setData({
      _num: rate
    })
    this.videoContext.playbackRate(Number(rate))
  },
  onReady() {
    wx.pauseBackgroundAudio()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.pauseBackgroundAudio()
    let productList = JSON.parse(options.productList);
    wx.setNavigationBarTitle({
      title: productList[0].title
    })
    let isLogin = getApp().globalData.isLogin;
    this.setData({
      isLogin: isLogin,
      options: productList,
      en: productList[0].alis[0].en_title,
      link: options.link
    })
    if (!isLogin) {
      let _self = this;
      api.getLoginPwd({
        success: res => {
          if (res.result) {
            _self.setData({
              modal9: true,
              value: res.result
            })
          }
        }
      })
    } else {
      this.loadDataPlay()
    }
  },
  loadDataPlay() {
    this.setData({
      alis: this.data.options[0].alis,
      desc: this.data.options[0].desc,
      name: this.data.options[0].title,
      infoList: this.data.options[0].infoList,
      playsource: this.data.options[0].playsource
    })
    this.videoContext = wx.createVideoContext('tui-video');
    let _self = this;
    if (_self.data.playsource && _self.data.playsource.length > 0) {
      _self.data.playsource.forEach(function(v) {
        if (v.fromname == _self.data.alis[0].en_title) {
          _self.setData({
            productList: v.list[0]
          })
        }
      })
    }

    if (getApp().globalData.playSource) {
      //记录存到服务器
      api.getplayHistory({
        data: {
          status: 0,
          list: this.data.options[0],
          link: this.data.link
        }
      })
    }
  },
  detail(e) {
    wx.vibrateShort() //短暂震动
    let jishu = e.currentTarget.dataset.jishu;
    this.getplay(this.data.playsource, jishu)
  },
  getplay(data, jishu) {
    let that = this;
    let indexNum = jishu.replace(/[^0-9]/ig, "")
    if (data && data.length > 0) {
      data.forEach(function(v) {
        if (v.fromname == that.data.en) {
          v.list.forEach(function(val) {
            if (val.name == jishu) {
              that.setData({
                productList: val
              })
            }
          })
        }
      })
    }
  },
  hide9() {
    this.setData({
      modal9: false
    })
  },
  login() {
    let _self = this;
    const res = wx.getSystemInfoSync()
    let errMsg = "手机品牌：" + res.brand + "；手机型号：" + res.model + "；微信版本号：" + res.version + "；操作系统版本：" + res.system + "；客户端平台：" + res.platform
    api.getUserLogin({
      data: {
        pwd: _self.data.value,
        IP: store.data.IP,
        IPaddress: store.data.IPaddress,
        IPCode: store.data.IPCode,
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
            _self.setData({
              modal9: false,
              isLogin: true
            })
            getApp().globalData.isLogin = true;
            _self.loadDataPlay()
            getApp().onloadInit()
          }
        }
      },
      fail: err => {
        wx.showToast({
          title: '登录失败~',
          icon: 'none',
          duration: 2800
        })
        _self.setData({
          modal9: true
        })
      }
    })
  }
})