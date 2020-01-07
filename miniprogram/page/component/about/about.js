const api = require('../../util/apicloud.js')
Page({
  data: {
    content: {}
  },
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    let that = this;
    api.getDescribe({
      success: res => {
        if (res.result) {
          let data = res.result
          that.setData({
            content: data
          })
        } else {
          wx.showToast({
            title: '未知错误',
            icon: 'none',
            duration: 2000
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
  email: function(e) {
    let email = e.currentTarget.dataset.email;
    let number = email.replace(/[^0-9]/ig, "")
    wx.setClipboardData({
      data: number,
      success(res) {
        wx.getClipboardData({
          success(res) {
            util.toast("复制内容:" + res.data, 2000, false)
          }
        })
      }
    })
  },
  previewReward: function(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src]
    })
  }
})