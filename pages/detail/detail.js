// pages/detail/detail.js
const app = getApp()
Page({
  data: {
    id:null,
    balance:null,
    array: {},
    userInfo:{},
    skey:null,
    openwindowhide: 'openwindowhide',
  },
  openWindow: function (a, b) {
    var that = this;
    if (!b) { b = ''; }
    that.setData({
      openwindowhide: '',
      openwindowtext: a + b
    });
    setTimeout(() => {
      that.setData({
        openwindowhide: 'openwindowhide',
      });
    }, 2000)
  },
  //提现
  pushCash:function(){
    var that=this;
    var id=that.data.id;
    var cashName = that.data.array.symbol;
    var cash = that.data.array.amount;
    if(cash>0){
      wx.navigateTo({
        url: '../cash/cash?id=' + id + '&cash=' + cash + '&cashName=' + cashName
      })
    }else{
      that.openWindow('没有足够的余额提现')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let skey = wx.getStorageSync('skey');
    if (skey) {
      that.setData({
        userInfo: wx.getStorageSync('userInfo'),
        skey: wx.getStorageSync('skey'),
        id: options.id
      })
      that.assetinfo();
    }
  },
  //资产详情
  assetinfo:function(){
    var that=this;
    var id = that.data.id;
    var mydata={
      id: id,
      skey:wx.getStorageSync('skey')
    }
    wx.request({
      url: app.globalData.itokenUrl +'/v1/wx/asset/info',
      method: 'GET',
      data: mydata,
      success: function (res) {
        if (res.data.code == '0') {
          //保存糖果列表数据
          that.setData({
            array: res.data.data
          });
        }
      }
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
  bindViewTap:function(){
    return false;
  },
  backup:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})