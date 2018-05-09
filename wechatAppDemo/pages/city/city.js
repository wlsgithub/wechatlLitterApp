// pages/city/city.js
const city = require('../../utils/util.js');
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    input: "",
    localcity: "",
    winHeight: 0,
    scrollTop: 0,//置顶高度
    letoview: "",//view定位
    scrollTopId: '',//置顶id
    searchLetter: [],//首字符索引
    parentPage:"",
    completeList: [],
    cityList: [],
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' },
    { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' },
    { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' },
    { cityCode: 420100, city: '武汉市' }, { cityCode: 120000, city: '天津市' },
    { cityCode: 610100, city: '重庆市' }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接受页面传递参数
    var localcity = options.city;
    var _parentPage = options.op;
    //-----获取设备信息---
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;//设备可使用高度
    //--加载js数据--
    const searchLetter = city.searchLetter;
    const cityList = city.cityList();
    const itemH = winHeight / searchLetter.length;
    let tempArr = [];
    searchLetter.map(
      (item, index) => {
        let temp = {};
        temp.name = item;
        temp.tHeight = index * itemH;//计算滚动位置
        temp.bHeight = (index + 1) * itemH;
        tempArr.push(temp)
      }
    );
    // console.log(JSON.stringify(tempArr));
    //--设置数据---
    this.setData({
      winHeight: winHeight,
      localcity: localcity,
      searchLetter: tempArr,
      cityList: cityList
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //城市点击函数
  bindCity: function (e) {
    var selecity = e.currentTarget.dataset.city;//选择的城市
    var apikey = "72ad07bf633449259fb0a1a888b82149";
    //-----获取经纬度
    wx.request({
      url: 'https://search.heweather.com/find?', //接口地址
      data: {
        key: apikey,
        location: selecity,
        group: "cn",
      },
      success: function (res) {
        var rs = res.data.HeWeather6[0];
        var latng = rs.basic[0].lon + "," + rs.basic[0].lat;//拼接经纬度
        //写入数据缓存
        try {
          wx.setStorageSync('newcode', latng);
          wx.switchTab({//关闭当前进行跳转
            url: '../weather/weather',
          })
        } catch (e) {
          wx.showToast({
            title: '请重试',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //搜索后选择
  chooseSelect: function (e) {
    var _lat = e.currentTarget.dataset.lngat;
    //写入数据缓存
    try {
      wx.setStorageSync('newcode', _lat);
      wx.switchTab({//关闭当前进行跳转
        url: '../weather/weather',
      })
    } catch (e) {
      wx.showToast({
        title: '请重试',
        icon: 'none',
        duration: 2000
      })
    }

  },
  //字母点击定位
  clickLetter: function (e) {
    var id = e.currentTarget.dataset.letter;
    this.setData({
      letoview: id,
    });
  },
  //点击回到顶部
  backtop: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  bindinput: function (e) {
    this.setData({
      inputName: ''
    })
  },
  //获取查询框输入，并执行自动查询方法
  bindKeyInput: function (e) {
    this.setData({
      inputName: e.detail.value
    })
    var val = e.detail.value;
    // console.log("查询输入=" + e.detail.value);
    if (val != "") {
      this.auto();
    } else {
      this.setData({
        completeList: "",
      })
    }

  },
  auto: function () {
    var that = this;
    let inputSd = this.data.inputName.trim();//输入
    //-------网络搜索-------
    var apikey = "72ad07bf633449259fb0a1a888b82149";
    //-----获取经纬度
    wx.request({
      url: 'https://search.heweather.com/find?', //接口地址
      data: {
        key: apikey,
        location: inputSd,
        group: "cn",
      },
      success: function (res) {
        var rs = res.data.HeWeather6[0];
        if (rs.status != "ok") {
          that.setData({
            completeList: "",
          })
        } else {
          let finalCityList = [];
          for (var i = 0; i < rs.basic.length; i++) {
            var _temp = { code: "", city: "", lngat: "" };
            var _tempreg = "undefined,";
            _temp.code = rs.basic[i].cid;
            _temp.city = rs.basic[i].admin_area + "," + rs.basic[i].parent_city + "," + rs.basic[i].location;
            _temp.city = _temp.city.replace(new RegExp(_tempreg), "");
            _temp.city = _temp.city.replace(new RegExp(_tempreg), "");
            _temp.lngat = rs.basic[i].lon + "," + rs.basic[i].lat;
            finalCityList.push(_temp);
          }
          that.setData({
            completeList: finalCityList,
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
    //-------本地搜索-------
    // let sd = inputSd.toLowerCase();
    // let num = sd.length;
    // // console.log("长度="+num);
    // const cityList = city.cityObjs;
    // let finalCityList = [];
    // let tempChinese = cityList.filter(
    //   itemChinese => {
    //     let textChinese = itemChinese.city.slice(0, num)
    //     return (textChinese && textChinese == sd)
    //   }
    // )
    // // console.log("1212="+JSON.stringify(tempChinese[0]));
    // if (tempChinese[0]) {
    //   tempChinese.map(
    //     item => {
    //       let testObj = {};
    //       testObj.city = item.city
    //       testObj.code = item.code
    //       finalCityList.push(testObj)
    //     })
    //   this.setData({
    //     completeList: finalCityList,
    //   })
    // } else {
    //   return
    // }
  },
})