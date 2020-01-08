const api = require('../../util/apicloud.js')
var videoList = {
  m: {
    page: 0,
    list: []
  },
  t: {
    page: 0,
    list: []
  },
  z: {
    page: 0,
    list: []
  },
  d: {
    page: 0,
    list: []
  }
}
const len = 36;
let a = 0,
  b = 0,
  c = 0,
  zlist = [];
Page({
  data: {
    category: [{
        name: '热门',
        id: 'remen'
      },
      {
        name: '电影',
        id: 'dianying'
      },
      {
        name: '电视剧',
        id: 'dianshi'
      },
      {
        name: '综艺',
        id: 'zongyi'
      },
      {
        name: '动漫',
        id: 'dongman'
      }
    ],
    productList: [],
    curIndex: 0,
    number: 0,
    isScroll: true,
    toView: 'remen',
    page: 1,
    type: '',
    scrollTop: 0
  },
  onShow: function() {
    let storeage = wx.getStorageSync('videoList');
    if (storeage && storeage != '') {
      videoList = storeage
    } else {
      videoList = {
        m: {
          page: 0,
          list: []
        },
        t: {
          page: 0,
          list: []
        },
        z: {
          page: 0,
          list: []
        },
        d: {
          page: 0,
          list: []
        }
      }
    }
  },
  onHide: function() {
    wx.setStorageSync('videoList', videoList);
  },
  bindscroll(e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  goTop() {
    this.setData({
      number: 0
    })
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '热门'
    })
    var self = this;
    self.gethotData()
  },
  switchTab(e) {
    const self = this;
    self.setData({
      toView: e.target.dataset.id,
      curIndex: e.target.dataset.index,
      number: 0
    })
    if (e.target.dataset.index == 0) {
      self.gethotData()
      wx.setNavigationBarTitle({
        title: '热门'
      })
    } else if (e.target.dataset.index == 1) {
      self.getShowData('m', '电影')
    } else if (e.target.dataset.index == 2) {
      self.getShowData('t', '电视剧')
    } else if (e.target.dataset.index == 3) {
      self.getShowData('z', '综艺')
    } else {
      self.getShowData('d', '动漫')
    }
  },
  getShowData: function(type, name) {
    a = 0, b = 0, c = 0, zlist = [];
    this.getData(type, this.getPageNum(type))
    wx.setNavigationBarTitle({
      title: name
    })
  },
  getPageNum: function(type) {
    let pageNumber = 1;
    return pageNumber
  },
  bindscrolltolower(e) {
    wx.vibrateShort() //短暂震动
    if (this.data.toView == "dianying") {
      this.getData('m', this.data.page + 1)
    } else if (this.data.toView == "dianshi") {
      this.getData('t', this.data.page + 1)
    } else if (this.data.toView == "zongyi") {
      this.getData('z', this.data.page + 1)
    } else if (this.data.toView == "dongman") {
      this.getData('d', this.data.page + 1)
    }
  },
  getData(type, page) {
    wx.showNavigationBarLoading()
    let that = this;
    that.setData({
      page: page,
      type: type
    })
    if (videoList[type].list.length > 0) {
      if (videoList[type].page >= that.data.page) {
        let plist = videoList[type].list;
        let length = Math.round(videoList[type].list.length / len)
        a = b;
        c = a + len;
        for (let j = a; j < c; j++) {
          zlist.push(plist[j])
          b = j + 1
        }
        that.setData({
          productList: zlist
        })
        wx.hideNavigationBarLoading()
      } else {
        this.getloadData(that, type, page)
      }
    } else {
      this.getloadData(that, type, page)
    }
  },
  getloadData: function(that, type, page) {
    wx.showNavigationBarLoading()
    api.getTypeData({
      data: {
        type: type,
        page: page,
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          let data = [];
          if (typeof res.result == "object") {
            data = res.result;
          } else {
            data = JSON.parse(res.result)
          }
          if (data.length <= 0) {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.getwriteData(that, type, data)
          }
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        })
      },
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    })
  },
  getwriteData: function(that, type, data) {
    let list = [];
    if (that.data.page == 1) {
      that.setData({
        productList: []
      })
      list = data
    } else {
      list = that.data.productList
      data.forEach(function(k) {
        list.push(k)
      })
    }
    that.setData({
      productList: list
    })
    videoList[type].list = list
    videoList[type].page = that.data.page
  },
  gethotData() {
    let that = this;
    let hotstoreage = wx.getStorageSync('hotstoreage')
    if (hotstoreage && hotstoreage != '') {
      if (hotstoreage.length > 0) {
        that.setData({
          productList: hotstoreage
        })
      } else {
        this.gethotloadData(that)
      }
    } else {
      this.gethotloadData(that)
    }
  },

  gethotloadData: function(that) {
    wx.showNavigationBarLoading()
    api.getIndexDataHotData({
      success: res => {
        var data = [];
        if (res.errMsg == "cloud.callFunction:ok") {
          if (typeof res.result == "object") {
            data = res.result
          } else {
            data = JSON.parse(res.result)
          }
          if (data.length > 0) {
            wx.setStorageSync('hotstoreage', data)
            that.setData({
              productList: data
            })
          }
        }
      },
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '/page/component/search/search'
    })
  }
})