// pages/life/dianying/dianying.js
const alllist = [{ sid: "0", lstype: "商圈", value: "", flag: "all" }, { sid: "1", lstype: "万达广场", value: "万达广场", flag: "all" }, { sid: "2", lstype: "银座商城", value: "银座商城", flag: "all" }, { sid: "3", lstype: "百货大楼", value: "百货大楼", flag: "all" }];
const nearlist = [{ sid: "0", lstype: "附近", value: "", flag: "near" }, { sid: "1", lstype: "1千米", value: "1000", flag: "near" }, { sid: "2", lstype: "3千米", value: "3000", flag: "near" }, { sid: "3", lstype: "5千米", value: "5000", flag: "near" }];
const sortlist = [{ sid: "0", lstype: "智能排序", value: "_distance asc", flag: "sort" }, { sid: "1", lstype: "离我最近", value: "_distance asc", flag: "sort" }, { sid: "2", lstype: "价格最低", value: "", flag: "sort" }];
const condilist = [];
var selectul = "";
var _winwidth = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cinemalist: [],
    selectul: [],
    filmInfos: [],
    errortips: "",
    tipsmargin: "",
    allitem: "全部",
    test: "测试",
    nearitem: "附近",
    sortitem: "排序",
    condiitem: "特色",
    _lng: "",
    _lat: "",
    isshow: false,
    category: "", nearby: "5000", orderby: "_distance asc", condi: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _lng: options.lng,
      _lat: options.lat,
    })

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
    //获取设备信息  用于布局
    try {
      //---------设备信息
      wx.getSystemInfo({
        success: function (res) {
          _winwidth = res.windowWidth / 4;
        },
      })
    } catch (e) {
      _winwidth = "90";
    };
    //----影片信息-----
    this.getfilmInfo();
    //----影院数据
    this.getLocalInfo(this.data._lat, this.data._lng, this.data.nearby, this.data.orderby, this.data.category);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  //获取附近信息
  getLocalInfo: function (j, w, r, o, c) {
    var that = this;
    //接口参数
    var _keyword = encodeURI("电影院");
    var _key = "VHDBZ-WPSWJ-JSIF7-KKI6T-27FMK-OKFJX";
    var _boundary = "nearby(" + j + "," + w + "," + r + ")";
    var _orderby = o;//升降序
    var _category = c;//分类
    //请求
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/search',
      data: {
        keyword: _keyword,
        boundary: _boundary,
        category: _category,
        orderby: _orderby,
        key: _key,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data.data;
        // console.log("结果-" + JSON.stringify(result));
        var _res = new Array();
        if (result.length < 1) {
          that.setData({
            errortips: "没有找到商家啊",
            tipsmargin: "50px",
          });
          return;
        } else {
          that.setData({
            errortips: "",
            tipsmargin: "",
          });
        }
        for (var i = 0; i < result.length; i++) {
          var temp = {
            id: "", name: "", halfadr: "", alladr: "", distan: "", tel: "", stype: ""
          };
          var tag = result[i].address;
          var regs1 = result[i].ad_info.province + result[i].ad_info.city + result[i].ad_info.district;//精简地址的正则匹配的字符串
          var regs2 = result[i].ad_info.province + result[i].ad_info.city;//全地址的正则匹配的字符串
          var halfadr = tag.replace(new RegExp(regs1), "");//精简地址
          var alladr = tag.replace(new RegExp(regs2), "");//全地址
          if (halfadr.length > 10) {
            halfadr = halfadr.substring(0, 9) + "...";
          }
          temp.id = result[i].id;
          temp.name = result[i].title;
          temp.halfadr = halfadr;
          temp.alladr = alladr;
          if (result[i]._distance > 1000) {
            temp.distan = (result[i]._distance / 1000).toFixed(2) + "km";
          } else {
            temp.distan = result[i]._distance + "m";
          }
          temp.tel = result[i].tel;
          temp.stype = result[i].category;
          _res.push(temp);
        }
        // console.log("结果=" + JSON.stringify(_res));
        that.setData({ cinemalist: _res });
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
  //条件选择  样式处理
  showselect: function (e) {
    var that = this;
    if (this.data.isshow == true) {
      that.setData({
        isshow: false,
      });
    } else {
      that.setData({
        isshow: true,
      });
    };
    var _class = e.currentTarget.dataset.id;
    switch (_class) {
      case "all":
        that.setData({
          selectul: alllist,
          ulmargin: "20",
        });
        break;
      case "near":
        that.setData({
          selectul: nearlist,
          ulmargin: 1.2 * _winwidth,
        });
        break;
      case "sort":
        that.setData({
          selectul: sortlist,
          ulmargin: 2 * _winwidth,
        });
        break;
      case "condi":
        that.setData({
          selectul: condilist,
          ulmargin: 3 * _winwidth,
        });
        break;
    }
  },
  ////--------变更数据
  changeinfo: function (e) {
    var that = this;
    var _name = e.currentTarget.dataset.name;
    var _value = e.currentTarget.dataset.value;
    var _flag = e.currentTarget.dataset.flag;
    //变更数据
    switch (_flag) {
      case "all":
        that.setData({
          allitem: _name,
          category: _value,
        });
        //----更新数据
        // this.getLocalInfo(this.data._lat, this.data._lng, this.data.nearby, this.data.orderby, this.data.category);
        break;
      case "near":
        that.setData({
          nearitem: _name,
          nearby: _value,
        });
        //----更新数据
        this.getLocalInfo(this.data._lat, this.data._lng, this.data.nearby, this.data.orderby, this.data.category);
        break;
      case "sort":
        that.setData({
          sortitem: _name,
          orderby: _value,
        });
        //----更新数据
        this.getLocalInfo(this.data._lat, this.data._lng, this.data.nearby, this.data.orderby, this.data.category);
        break;
      case "condi":
        that.setData({
          condiitem: _name,
          condi: _value
        });
        //----更新数据
        this.getLocalInfo(this.data._lat, this.data._lng, this.data.nearby, this.data.orderby, this.data.category);
        break;
    };
    //-----选择后关闭
    this.setData({
      isshow: false,
    });

  },
  ///-------影片信息--
  getfilmInfo: function () {
    var that = this;
    wx.request({
      // url: 'https://api.douban.com/v2/movie/in_theaters?start=0&count=10',
      url: "https://m.maoyan.com/movie/list.json?type=hot",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var filmInfo = new Array();
        for (var i = 0; i < res.data.data.movies.length; i++) {
          var tempInfo = { fid: "", name: "", imageSrc: "", stars: "" };
          tempInfo.fid = res.data.data.movies[i].id;
          tempInfo.name = res.data.data.movies[i].nm;
          tempInfo.imageSrc = res.data.data.movies[i].img;
          if (res.data.data.movies[i].sc == "") {
            tempInfo.stars = "预售";
          } else {
            tempInfo.stars = res.data.data.movies[i].sc + "分";
          }
          filmInfo.push(tempInfo);
        }
        that.setData({
          filmInfos: filmInfo
        });
      },
    })
  },
  //-----更多---
  morefilms: function () {
    wx.navigateTo({
      url: 'filmore/filmore',
    })
  },
})

