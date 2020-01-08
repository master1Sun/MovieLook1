const wxRequest = (params, url, tip) => {
  if (tip) {
    wx.showLoading({
      title: tip,
    })
  }
  wx.cloud.callFunction({
    // 要调用的云函数名称
    name: url,
    data: params.data || {},
    success: res => {
      params.success && params.success(res)
    },
    fail: err => {
      params.fail && params.fail(err)
    },
    complete: c => {
      params.complete && params.complete(c)
      wx.hideLoading()
    }
  })
}


//getconfig


//用户登录验证
const getsystemInit = (params) => {
  params.data ? params.data.NODEJS = 0 : params.data = { NODEJS: 0 }
  wxRequest(params, 'getinit')
}
//记录播放的电影记录
const getplayHistory = (params) => {
  params.data ? params.data.NODEJS = 1 : params.data = { NODEJS: 1 }
  wxRequest(params, 'getinit')
}
//getNetData

//热门电影信息
const getIndexDataHotData = (params) => {
  params.data ? params.data.NODEJS = 0 : params.data = { NODEJS: 0 }
  wxRequest(params, 'getNetData', '正在获取数据...')
}
//电影类型页面信息
const getTypeData = (params) => {
  params.data ? params.data.NODEJS = 1 : params.data = { NODEJS: 1 }
  wxRequest(params, 'getNetData', '正在获取数据...')
}
//电影详细信息
const getDataInfo = (params) => {
  params.data ? params.data.NODEJS = 2 : params.data = { NODEJS: 2 }
  wxRequest(params, 'getNetData', '正在获取数据...')
}
//电影播放源信息
const getPlayDataInfo = (params) => {
  params.data ? params.data.NODEJS = 3 : params.data = { NODEJS: 3 }
  wxRequest(params, 'getNetData', '正在获取数据...')
}
//搜索电影信息
const getSearchDataInfo = (params) => {
  params.data ? params.data.NODEJS = 4 : params.data = { NODEJS: 4 }
  wxRequest(params, 'getNetData', '正在获取数据...')
}
//每日一文
const getOneOnly = (params) => {
  params.data ? params.data.NODEJS = 5 : params.data = { NODEJS: 5 }
  wxRequest(params, 'getNetData')
}

module.exports = {
  getsystemInit,
  getplayHistory,
  getIndexDataHotData,
  getTypeData,
  getDataInfo,
  getPlayDataInfo,
  getSearchDataInfo,
  getOneOnly
}