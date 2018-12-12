//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    currentTab: 0,
    iconColor: [
      '../../images/home.png', '../../images/home1.png', '../../images/zc.png', '../../images/zc1.png'],
    defaultIcon: '../../images/logo100.png',//默认资产头像
    marray: [],//我的资产
    candycount: '',
    array: [],
    openwindowhide: 'openwindowhide',
    openwindowtext: '',
    userInfo: wx.getStorageSync('userInfo'),
    hasUserInfo: wx.getStorageSync('hasUserInfo'),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '来领取糖果吧',
      path: 'pages/index/index'
    }
  },
  onLoad: function () {
    var that = this;
    console.log(wx.getStorageSync('hasUserInfo'));
    if (wx.getStorageSync('skey')){
      that.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo:true
      });
    }
    //初始化调用糖果列表
    that.getCandyList()
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
  //事件处理函数
  //糖果事件
  onclickByPinpai: function (e) {
    let that = this;
    if (wx.getStorageSync("skey")) {
      if (e.currentTarget.dataset.have == '0') {
        if (e.currentTarget.dataset.currentcount > 0) {
          //领取
          var candyamount = e.currentTarget.dataset.amount;
          let id = e.currentTarget.id.slice(5);
          let skey = app.globalData.skey;
          let data = { id: id, skey: skey }
          wx.request({
            url: app.globalData.itokenUrl + '/v1/wx/candy/receive',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: data,
            success: function (res) {
              if (res.data.code == '0') {

                wx.showToast({
                  title: '成功领取 ' + candyamount,
                  icon: 'success',
                  duration: 2000
                })
              }
              //调用糖果列表
              that.getCandyList()
            }
          })

          //
        } else {
          that.openWindow('糖果已经领完啦')
        }
        //领取糖果

      } else if (e.currentTarget.dataset.have == '1') {
        that.openWindow('您已经领取过了')
      }
    } else {
      var opentitle = '请先授权'
      that.openWindow(opentitle)
    }

  },
  //调用糖果列表数据
  getCandyList: function () {
    let that = this;
    var mdata = {
      skey: wx.getStorageSync("skey")
    }
    wx.request({
      url: app.globalData.itokenUrl + '/v1/wx/candy/list',
      method: 'get',
      data: mdata,
      success: function (res) {
        if (res.statusCode == '200') {
          //保存糖果列表数据
          that.setData({ array: res.data.data });
        }
      }
    })
  },
  //获取用户数据
  getUserInfo: function (e) {
    let that = this;
    if (e.detail.userInfo) {
      app.getUser(e);
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
      that.setData({
        currentTab: 0
      });
    } else {
      that.setData({
        userInfo: null,
        hasUserInfo: null
      })
    }
  },
  bindViewTap: function () {
    return false;
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    return false;
  },
  bindopensetting: function (e) {
    console.log(e);
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
    if (that.data.currentTab == '1') {
      that.assetsList();
    }
    if (that.data.currentTab == '0') {
      that.getCandyList();//切换调用
    }
    return false;
  },
  //获取资产列表
  assetsList: function () {
    var that = this;
    var mydata = {
      skey: wx.getStorageSync("skey")
    }
    wx.request({
      url: app.globalData.itokenUrl + '/v1/wx/asset/list',
      method: 'get',
      data: mydata,
      success: function (res) {
        if (res.data.code == '0') {
          //保存糖果列表数据
          //console.log(res.data);
          that.setData({
            marray: res.data.data
          });
          //console.log(that.data.marray);
        }
      }
    })
  },
  //资产详情
  onclickDetail: function (e) {
    var id = e.currentTarget.id.slice(5);
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  }
})
