// pages/weather/wether.js
var app = getApp();//获取当前小程序实例
Page({
  /**
   * 页面的初始数据
   */
  data: {//设置页面数据，后面空值将在页面显示时通过请求服务器获取
    cityId: app.cityId,
    basic: "",
    daily: "",
    TqLogo: "",
    update: "",
    suggestion: "",
    airQullty:"",
    futherweather:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //是否授权获取位置
    wx.getSetting({
      success(res) {
        // console.log("授权=" + res.authSetting['scope.userLocation']);
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用功能，后续调用 接口不会弹窗询问
             // console.log("同意");
            },
            fail(){
              //console.log("不同意");
            }
          })
        }
      }
    });
    ///----清除缓存---
    try {
      wx.clearStorageSync()
    } catch (e) {
      // Do something when catch error
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log("show");
    var that = this;
    wx.showToast({ //消息提示框
      title: '加载中',
      icon: "loading",
      duration: 3000
    })
    //-------------取缓存
    try {
      var value = wx.getStorageSync('newcode');
      if (value) {
        // console.log("获取缓存=" + value);
        this.getweather(value);
        this.getsuggestion(value);
        this.getAirQulty(value);
      } else{
        // console.log("缓存为空");
        //定位获取
        this.getlocal();
      }
    } catch (e) {
      // console.log("没获取");
      //定位获取
      this.getlocal();
    }   
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
      //更新数据
     wx.clearStorageSync();//清缓存
     //定位获取
     this.getlocal();
     wx.stopPullDownRefresh();//停止下拉
  },
  //定位函数
  getlocal:function(){
    // console.log("定位");
    var that = this;
    //定位获取
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var local = latitude + "," + longitude;
        // console.log("定位=" + local);
        that.getweather(local);
        //指数
        that.getsuggestion(local);
        //空气
        that.getAirQulty(local);
      },
      //定位失败
      fail: function () {
        // console.log("默认");
        that.getweather(app.cityId);
        //指数
        that.getsuggestion(app.cityId);
        //----空气
        that.getAirQulty(app.cityId);
      }
    })
  },
  //自定义函数  获取天气api
  getweather: function (local) {
    var that = this;
    wx.request({  //网络请求  类似ajax
      url: 'https://free-api.heweather.com/s6/weather/forecast',
      data: { location: local, key: '72ad07bf633449259fb0a1a888b82149' },//和风天气提供用户key
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        var d = res.data.HeWeather6[0];
        var _futher=new Array();
        // console.log("dddd="+JSON.stringify(d));
        wx.hideToast();//隐藏加载框
        //加载图片
        var TqPicSrc = "https://www.heweather.com/files/images/cond_icon/" + d.daily_forecast[0].cond_code_d + ".png";
        //----未来天气
        for (var i = 0; i <3;i++){
          var _temp={id:"",wdate:"",wimg:"",wtext:"",wtemp:""};
          _temp.id=i;
          if(i==0){
            _temp.wdate = "今天 " + d.daily_forecast[i].date.substring(6);
          }else if(i==1)
          {
            _temp.wdate = "明天 " + d.daily_forecast[i].date.substring(6);
          } else if (i==2){
            _temp.wdate = "后天 " + d.daily_forecast[i].date.substring(6);
          }
          _temp.wimg = "https://www.heweather.com/files/images/cond_icon/" + d.daily_forecast[i].cond_code_d + ".png";
          _temp.wtext = d.daily_forecast[i].cond_txt_d;
          _temp.wtemp = d.daily_forecast[i].tmp_max + "℃ ~ " + d.daily_forecast[i].tmp_min +"℃";
          _futher.push(_temp);
        }
        //更新数据，视图将同步更新
        that.setData(
          { basic: d.basic, daily: d.daily_forecast[0], TqLogo: TqPicSrc, update: d.update, futherweather: _futher });
          //全局数据 缓存
          let temp={cityName:"",weathLog:"",lng:"",lat:""};
          temp.cityName = d.basic.location;
          temp.weathLog = TqPicSrc;
          temp.lng=d.basic.lon;
          temp.lat=d.basic.lat;
          wx.setStorage({
            key: 'localcityinfo',
            data:temp,
          })
      }
    })
  },
  //获取生活指数API
  getsuggestion: function (local) {
    var that = this;
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/lifestyle',
      data: { location: local, key: '72ad07bf633449259fb0a1a888b82149' },
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        var d = res.data.HeWeather6[0];
        that.setData({ suggestion: d.lifestyle })//更新数据
        // fn(res.data.HeWeather6[0]);
      }
    })
  },
//--------空气质量--
  getAirQulty: function (local){
  var that = this;
  wx.request({
    url: 'https://free-api.heweather.com/s6/air?',
    data: { location: local, key: '72ad07bf633449259fb0a1a888b82149' },
    header: { 'Content-Type': 'application/json' },
    success: function (res) {
      var d = res.data.HeWeather6[0];
      if (d.status=="ok"){
        that.setData({ airQullty:d.air_now_city.qlty })//更新数据
      }
    }
  })
},
  //4、页面事件绑定部分
  bindViewTap: function () {
    var ct =this.data.basic.location;
    wx.navigateTo({ url: '../city/city?op=wt&city='+ct}) },//跳转菜单页面 
 
})
