// pages/life/life.js
var app = getApp();//获取当前小程序实例，方便使用全局方法和属性
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: "3000",
    duration: "500",
    localcityName: "",
    localcityWtL: "",
    localLng:"",
    localLat:"",
    imgUrls: [{id:1,src:"../../images/life/meishi.jpg"},
      {id:2, src:"../../images/life/dianying.jpg"},
      { id:3, src:"../../images/life/waimai.jpg"}],
    ulike: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    var that=this;
    //更新数据
    wx.clearStorageSync();//清缓存
    //定位获取
    //--获取定位
    var islocal = "";
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        islocal = true;
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.getLocalInfo(islocal, latitude, longitude, "");
      },
      fail: function () {
        islocal = false;
        var localcity = app.cityName;
        that.getLocalInfo(islocal, "", "", localcity);
      },
    })
    wx.stopPullDownRefresh();//停止下拉
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    try {
      //取缓存
      wx.getStorage({
        key: 'localcityinfo',
        success: function (res) {
          that.setData({
            localcityWtL: res.data.weathLog,//天气图标
            localcityName: res.data.cityName,//城市名称
            localLng:res.data.lng,
            localLat:res.data.lat,
          });
          //----数据更新
          that.getLocalInfo(false, res.data.lat, res.data.lng, res.data.cityName);
        },
      })
    } catch (e) {
      //--获取定位
      var islocal = "";
      wx.getLocation({
        type: "wgs84",
        success: function (res) {
          islocal = true;
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.getLocalInfo(islocal, latitude, longitude, "");
        },
        fail: function () {
          islocal = false;
          var localcity = app.cityName;
          that.getLocalInfo(islocal, "", "", localcity);
        },
      })
    };
  },
  //获取附近信息
  getLocalInfo: function (y, j, w, c) {
    var that = this;
    //不同条件不同接口参数
    var _keyword = encodeURI("美食");
    var _boundary = new Array();
    var key = "VHDBZ-WPSWJ-JSIF7-KKI6T-27FMK-OKFJX";
    if (y) {
      _boundary = "nearby(" + j + "," + w + "," + "5000)";
    } else {
      _boundary = "region(" + c + "," + "0)";
    }
    //请求
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/search',
      data: {
        boundary: _boundary,
        keyword: _keyword,
        key: key,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data.data;
        var _res = new Array();
        for (var i = 1; i < 5; i++) {
          var temp = {
            id: "", name: "", addres: "", tel: "", stype: ""
          };
          var tag = result[i].address;
          var regs1 = result[i].ad_info.province;
          var regs2 = result[i].ad_info.city; 
          var regs3 = result[i].ad_info.district;//正则匹配的字符串
          tag = tag.replace(new RegExp(regs1), "");//精简地址
          tag = tag.replace(new RegExp(regs2), "");//精简地址
          tag = tag.replace(new RegExp(regs3), "");//精简地址   多重匹配是因为直辖市数据问题 
          if(tag.length>16){
            tag=tag.substring(0,15)+"...";
          }
          temp.id = result[i].id;
          temp.name = result[i].title;
          temp.addres = tag;
          temp.tel = result[i].tel
          temp.stype = result[i].category;
          _res.push(temp);
        }
        // console.log("结果=" + JSON.stringify(_res));
        that.setData({ ulike: _res });
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        });
        console.log("网络错误=" + JSON.stringify(res));
      }
    })
  },
  //页面跳转
  banktag: function (e) {
    var a = e.currentTarget.id;
    var lng = this.data.localLng;
    var lat=this.data.localLat;
    switch (a) {
      case "m":
        wx.navigateTo({
          url: 'meishi/meishi?lng='+lng+"&lat="+lat,
        });
        break;
      case "d":
        wx.navigateTo({
          url: 'dianying/dianying?lng='+lng+"&lat="+lat,
        });
        break;
      case "j":
        wx.navigateTo({
          url: 'jiudian/jiudian?lng='+lng+"&lat="+lat,
        });
        break;
      case "w":
        wx.navigateTo({
          url: 'waimai/waimai?lng='+lng+"&lat="+lat,
        });
        break;
    }
  },
  //切换城市
  changecity:function(){
    var ct = this.data.localcityName;
    wx.navigateTo({ url: '../city/city?city=' + ct});//跳转菜单页面 
  }

})