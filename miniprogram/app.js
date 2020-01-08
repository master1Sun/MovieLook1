const api = require('/page/util/apicloud.js')
App({
  //全局数据，中文日期，供转换用
  chineseDate: {
    years: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  },
  onLaunch: function() {
    if (!wx.cloud) {
      wx.showToast({
        title: '您的微信版本太低',
        icon: 'none',
        duration: 3000
      })
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经上线啦~，为了获得更好的体验，建议立即更新',
              showCancel: false,
              confirmColor: "#5677FC",
              success: function(res) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '更新失败',
              content: '新版本更新失败，为了获得更好的体验，请您删除当前小程序，重新搜索打开',
              confirmColor: "#5677FC",
              showCancel: false
            })
          })
        }
      })
    } else {
      // 当前微信版本过低，无法使用该功能
    }
    this.onloadInit();
    wx.onMemoryWarning(function() {
      wx.showToast({
        title: '小程序内存不足警告~',
        icon: "none"
      })
    })
  },
  onloadInit() {
    let _self = this;
    const systemInfo = wx.getSystemInfoSync()
    api.getsystemInit({
      data: {
        systemInfo: systemInfo
      },
      success: res => {
        _self.globalData.playSource = res.result.playSource;
        _self.globalData.music = res.result.music || {};
        _self.globalData.public = res.result.public
        if (res.result.music) {
          wx.playBackgroundAudio({
            dataUrl: res.result.music.musicUrl,
            title: res.result.music.musicTitle,
            coverImgUrl: res.result.music.musicImgUrl
          })
        }
      }
    })
  },
  onShow: function() {
    const res = wx.getStorageInfoSync()
    if (res.limitSize - res.currentSize < 150) {
      wx.clearStorage()
    }
  },
  onHide: function() {
    wx.pauseBackgroundAudio()
  },
  globalData: {
    playSource: false,
    music: {},
    public: false
  }
})