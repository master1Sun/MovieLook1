const api = require('../../util/apicloud.js')
let timeId = null;
Page({
  data: {
    history: [],
    hot: [],
    result: [],
    value: '',
    showResult: false,
    searchText: 'Oh~~ 正在搜索中...'
  },
  cancelSearch() {
    this.setData({
      showResult: false,
      value: ''
    })
  },
  searchInput(e) {
    if (e.detail.value) {
      this.setData({
        showResult: true,
        result: [],
        searchText: 'Oh~~ 正在搜索中...'
      })
      this.historyHandle(e.detail.value);
      this.search(e.detail.value);
    }
  },
  keywordHandle(e) {
    const text = e.target.dataset.text;
    this.setData({
      value: text,
      showResult: true,
      result: [],
      searchText: 'Oh~~ 正在搜索中...'
    })
    this.historyHandle(text);
    this.search(text);
  },
  historyHandle(value) {
    let history = this.data.history;
    const idx = history.indexOf(value);
    if (idx === -1) {
      // 搜索记录只保留8个
      if (history.length > 12) {
        history.pop();
      }
    } else {
      history.splice(idx, 1);
    }
    history.unshift(value);
    wx.setStorageSync('history', JSON.stringify(history));
    this.setData({
      history
    });
  },
  onLoad(options) {
    const history = wx.getStorageSync('history');
    if (history) {
      this.setData({
        history: JSON.parse(history)
      })
    }
  },
  onShow() {
    this.setData({
      hot: getApp().globalData.hot
    })
  },
  search(value) {
    let that = this;
    wx.showNavigationBarLoading()
    api.getSearchDataInfo({
      data: {
        name: value,
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          var data = [];
          if (typeof res.result == "object") {
            data = res.result
          } else {
            data = JSON.parse(res.result)
          }
          if (data.length <= 0) {
            that.setData({
              searchText: 'Oh~~搜索结果为空！'
            })
          } else {
            that.setData({
              result: data
            })
          }
        } else {
          that.setData({
            searchText: 'Oh~~搜索结果为空！'
          })
        }
      },
      fail: err => {
        that.setData({
          showResult: false,
          searchText: 'Oh~~搜索结果为空！'
        })
      },
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    })
  },
})