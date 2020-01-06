const api = require('../../util/apicloud.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    footertitle: '',
    page: 0
  },
  // onReachBottom() {
  //   this.setData({
  //     page: this.data.page + 1
  //   })
  //   this.loadData();
  // },
  // onPullDownRefresh() {
  //   this.setData({
  //     page: 0
  //   })
  //   this.loadData();
  //   wx.stopPullDownRefresh()
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData();
  },
  loadData() {
    wx.showNavigationBarLoading()
    let that = this;
    //记录存到服务器
    api.getplayHistory({
      data: {
        status: 1,
        page: that.data.page
      },
      success: res => {
        if (res.result.errMsg == "collection.get:ok") {
          let data = res.result.data
          if (data.length > 0) {
            data.sort(function(a, b) {
              return b.count - a.count;
            })
            that.setData({
              list: data,
              footertitle: '已加载全部数据'
            })
          } else {
            that.setData({
              footertitle: '已经到底了'
            })
          }
        } else {
          that.setData({
            footertitle: '暂未发现更多数据'
          })
          wx.showToast({
            title: '未知错误~',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: err => {
        that.setData({
          footertitle: '暂未发现更多数据'
        })
        wx.showToast({
          title: '服务器错误~',
          icon: 'none',
          duration: 2000
        })
      },
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    })
  }
})