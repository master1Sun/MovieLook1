Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    footertitle: '',
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    let _self = this;
    let listkey = [];
    let list = [];
    const res = wx.getStorageInfoSync()
    if (res.keys.length > 0) {
      res.keys.forEach(function(v) {
        if (v != 'hotstoreage' && v != 'student' && v != 'videoList') {
          listkey.push(v)
        }
      })
      listkey.forEach(function(v) {
        list.push(wx.getStorageSync(v))
      })
      if (list.length > 0) {
        _self.setData({
          dataList: list.reverse(),
          footertitle: '已加载全部数据'
        })
      } else {
        _self.setData({
          footertitle: '暂未发现历史记录'
        })
      }
    } else {
      _self.setData({
        footertitle: '暂未发现历史记录'
      })
    }
    wx.hideNavigationBarLoading()
  }
})