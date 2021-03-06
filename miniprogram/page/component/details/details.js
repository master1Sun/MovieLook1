const api = require('../../util/apicloud.js')
Page({
  data: {
    height: 64, //header高度
    top: 35, //标题图标距离顶部距离
    curIndex: 0,
    href: '',
    public: false,
    showPlayButton: false,
  },
  back: function () {
    wx.navigateBack()
  },
  onShow() {
    this.setData({
      public: getApp().globalData.public,
    })
  },
  onLoad(options) {
    wx.showNavigationBarLoading()
    let that = this;
    that.setData({
      href: options.link,
      public: getApp().globalData.public
    })
    let storeage = wx.getStorageSync(options.title)
    if (storeage && storeage != '' && storeage.length > 0) {
      that.setData({
        productList: storeage,
      })
      wx.setNavigationBarTitle({
        title: storeage[0].title
      })
      wx.hideNavigationBarLoading()
    } else {
      that.getCloudloadData(that, options.link)
    }
  },
  getCloudloadData(that, link) {
    wx.showNavigationBarLoading()
    api.getDataInfo({
      data: {
        url: link
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          let data = [];
          if (typeof res.result == "object") {
            data = res.result;
          } else {
            data = JSON.parse(res.result);
          }
          if (data.length > 0) {
            data[0].url = that.data.href;
            that.setData({
              productList: data,
            })
            wx.setNavigationBarTitle({
              title: data[0].title
            })
            wx.setStorageSync(data[0].title, that.data.productList);
          } else {
            wx.showToast({
              title: '加载数据出错',
              icon: 'none',
              duration: 2000
            })
            wx.navigateBack()
          }
        }
      },
      fail: err => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack()
      },
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    })
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  playVideo() {
    wx.navigateTo({
      url: '/page/component/playVideo/playVideo?productList=' + JSON.stringify(this.data.productList) + '&link=' + this.data.href
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      if (this.data.productList.length > 0) {
        let that = this;
        setTimeout(function () {
          that.setData({
            showPlayButton: true
          })
        }, 500)
        return {
          title: '我想要看《' + this.data.productList[0].title + '》点击进来就可以查看详细内容',
          path: '/page/component/playVideo/playVideo?productList=' + JSON.stringify(this.data.productList) + '&link=' + this.data.href,
          imageUrl: this.data.productList[0].image
        }
      }
    }
    return {
      title: '推荐你看《' + this.data.productList[0].title + '》',
      path: '/page/component/details/details?link=' + this.data.href + '&title' + this.data.productList[0].title
    }
  }
})