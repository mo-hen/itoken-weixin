//app.js
App({
  //点击登录
  iTokenlogin: function (e) {
    console.log("到这里了")
    var that = this;
    var skey = wx.getStorageSync('skey')
    if (!skey) {
      wx.login({
        success: function (res) {
          if (res.code) {
            var mydata = {
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            }
            wx.request({
              url: that.globalData.itokenUrl + '/v1/wx/user/login',
              data: mydata,
              success: function (res) {
                console.log(res)
                that.globalData.userInfo = res.data.data.userInfo;
                that.globalData.skey = res.data.data.skey;
                that.globalData.hasUserInfo = true;
                console.log(that.globalData.hasUserInfo);
                wx.setStorage({
                  key: 'skey',
                  data: res.data.data.skey,
                })
                wx.setStorageSync('userInfo', res.data.data.userInfo);
                wx.setStorageSync('hasUserInfo', true);
              }
            });
          }//if结束
        }
      });
    } else {
      that.globalData.userInfo = wx.getStorageSync('userInfo')
    }

  },
  //获取用户信息
  getUser: function (e) {
    var that = this;
    that.iTokenlogin(e);
  },
  //登录
  onLaunch: function () {
    var that = this;
    let loginFlag = wx.getStorageSync('skey');
    if (loginFlag) {
      // 检查 session_key 是否过期
      wx.checkSession({
        // session_key 有效(未过期)
        success: function () {
          // 业务逻辑处理
          that.globalData.userInfo = wx.getStorageSync('userInfo');
          that.globalData.skey = loginFlag;
          that.globalData.hasUserInfo = true;
        },
        // session_key 过期
        fail: function () {
          // session_key过期，重新登录
          //doLogin();
          that.globalData.hasUserInfo = false;
        }
      });
    } else {
      // 无skey，作为首次登录
      //doLogin();
      that.globalData.hasUserInfo = false;
    }
  },
  globalData: {
    userInfo: null,
    skey: null,
    hasUserInfo: null,
    itokenUrl: 'https://ttttoken.xyz'
  }
})