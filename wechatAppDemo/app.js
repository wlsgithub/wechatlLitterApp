//app.js
App({
  onLaunch: function () {
    //系统事件部分
    var that = this;
    that.cityId = wx.getStorageSync('cityId') || that.cityId;//API：获取本地缓存，若不存在设置为全局属性
    that.setlocal('cityId', that.cityId);

    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
   
  },
  //2、自定义全局方法部分
  setlocal: function (id, val) {
    wx.setStorageSync(id, val);//API：设置本地缓存
  },
  //3、自定义全局属性部分
  cityId: "CN101010100",
  cityName:"北京市",
  // globalData: {
  //   userInfo: null
  // }
})