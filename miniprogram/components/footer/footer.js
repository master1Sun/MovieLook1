Component({
  externalClasses: ['tui-footer-class'],
  properties: {
    //type target url delta appid path extradata bindsuccess bindfail text color size
    //链接设置  数据格式对应上面注释的属性值
    navigate: {
      type: Array,
      value: []
    },
    //底部文本
    copyright: {
      type: String,
      value: "All Rights Reserved."
    },
    //copyright 字体颜色
    color: {
      type: String,
      value: "#A7A7A7"
    },
    //copyright 字体大小
    size: {
      type: Number,
      value: 24
    },
    //footer背景颜色
    bgcolor: {
      type: String,
      value: "none"
    },
    //是否固定在底部
    fixed: {
      type: Boolean,
      value: true
    }
  },
  data: {

  },
  methods: {
    clearStoreage() {
      if (getApp().globalData.playSource) {
        wx.vibrateShort() //短暂震动
        const storage = wx.getStorageInfoSync()
        let size = (storage.currentSize / 1024).toFixed(2)
        wx.showModal({
          title: '提示',
          content: '当前缓存已使用' + size + '兆是否清理？',
          confirmColor: '#5677FC',
          success: (res) => {
            if (res.confirm) {
              wx.vibrateShort() //短暂震动
              wx.clearStorageSync()
              wx.showToast({
                title: '清理成功~',
                icon: "none"
              })
            }
          }
        });
      }
    },
    playhistory() {
      if (getApp().globalData.playSource) {
        wx.vibrateShort() //短暂震动
        wx.navigateTo({
          url: "/page/component/playhistory/playhistory"
        })
      }
    },
    top100() {
      if (getApp().globalData.playSource) {
        wx.vibrateShort() //短暂震动
        wx.navigateTo({
          url: "/page/component/top/top"
        })
      }
    }
  }
})