// pages/life/dianying/filmore/filmore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filmInfos:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getfilmInfo();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  ///-------影片信息--
  getfilmInfo: function () {
    var that = this;
    wx.request({
      url: "https://m.maoyan.com/movie/list.json?type=hot&offset=0&limit=20",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var filmInfo = new Array();
        for (var i = 0; i < res.data.data.movies.length; i++) {
          var tempInfo = { fid: "", name: "", imageSrc: "", stars: "",ftype:"",fdate:"",factor:"" };
          tempInfo.fid = res.data.data.movies[i].id;
          tempInfo.name = res.data.data.movies[i].nm;
          tempInfo.imageSrc = res.data.data.movies[i].img;
          tempInfo.ftype = res.data.data.movies[i].cat;
          tempInfo.fdate = res.data.data.movies[i].rt;
          tempInfo.factor = res.data.data.movies[i].star;
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
})
