// pages/cash/cash.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    cash:'',
    openwindowhide: 'openwindowhide',
    cashName:'',
    disabled: 'false',
    inputValue:'',
    array: [{
      message: 'foo',      
    }],
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
  setDisabled: function (e) {
    var that=this;
      that.setData({
        disabled: '',
        inputValue: e.detail.value
      })
  },
  backup: function () {
    console.log("aaa");
    wx.navigateBack({
      delta: 1
    })
  },
  bindKeyInput: function (e) {
    console.log(e);
    var that=this;
    if (e.detail.cursor == '0'){
      console.log(e.detail.value);
      that.setData({
        inputValue: e.detail.value,
        disabled:'false'
      });
    }else{
      that.setDisabled(e);
    }
    
  },
  sendDate:function(e){
    console.log(e.detail);
    var that=this;
    var data={
      id:that.data.id,
      skey:wx.getStorageSync('skey'),
      amount:that.data.cash,
      address:that.data.inputValue
    }
    //提现
    wx.request({
      url: app.globalData.itokenUrl +'/v1/wx/asset/withdraw',
      data: data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code== '0'){
          that.openWindow("申请提现成功");
          that.setData({
            disabled: 'false'
          });
          setTimeout(function () {
            wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
              url: '/pages/index/index'
            })
          }, 3000);
        }else{
          console.log(res.data.msg);
          that.openWindow(res.data.msg);
          that.setData({
            disabled: 'false'
          });
        }
      },fail:function(res){
        that.openWindow('接口失败');
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
    let skey = wx.getStorageSync('skey');
    if(skey){
      that.setData({
        id:options.id,
        cash:options.cash,
        cashName: options.cashName
      });
    }
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
  
  }
})