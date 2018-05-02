// pages/login/login.js
var crypt = require('../../utils/WXBizDataCrypt.js')
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AppId : 'wxde8668957ab7fd34',
    AppSecret : 'c5437f3702c4f432505e35671b2d4c6d',
    last_time: '',
    is_show: true,
    systemInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.currentPlatform=res.platform
        wx.showToast({
          title: '当前设平台：' + res.platform,
          icon:'none'
        })
        that.setData({
          systemInfo:res
        })
      },
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

  /**W
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
  /**
   * 登入
   */

  bylogin:function(event){
    var timestamp = Date.parse(new Date());  
    console.log("开始登入 timestamp=" + timestamp)
    var that=this
    var phone = event.detail.value.phone
    var code = event.detail.value.code
    console.log("phone="+phone + ",code=" + code)
    var msg=verfyLoginData(phone,code)
    // wx.authorize({
    //   scope: 'scope.userInfo',
    //   success:function(res){
        
    //   },
    //   fail:function(err){

    //   }
    // })
    wx.checkSession({
      success:function(res){
        console.log(res)
      },
      fail:function(err){
        console.log(err)
      }
    })
    wx.login({
      success: function (res) {
        if(res.code){
          var code=res.code
          //开发者服务器使用 临时登录凭证code 获取 session_key 和 openid 等  这里的数据最好是拼接在后面
          console.log("code=" + code)
          var murl = 'https://api.weixin.qq.com/sns/jscode2session?appId=' + that.data.AppId + '&secret=' + that.data.AppSecret + '&js_code=' + code + '&grant_type=authorization_code'
          console.log("murl=" + murl)
          wx.request({
            url: murl,
            method: 'POST', 
            success:function(info){
              console.log(info)
              var pc = new crypt(that.data.AppId, info.data.session_key)
              wx.getUserInfo({
                success: function (res) {
                  console.log(res)
                  var result = pc.decryptData(res.encryptedData, res.iv)
                  var openid = result.openId
                  wx.setStorageSync('openid', openid)
                  wx.showToast({
                    title: 'openid=' + openid,
                    icon:'none'
                  })
                  if(openid!=null && openid!= undefined){
                    wx.switchTab({
                      url: '../home/home',
                    })
                  }
                  console.log("解密数据：")
                  console.log(result)
                }
              })
            },fail:function(err){

            }
          })
        }else{
          console.log('微信登录失败！' + res.errMsg)
        }
      }
    })

    var localChacheOpenid = wx.getStorageSync('openid')
    console.log("openid=", localChacheOpenid)
    wx.getStorageInfo({
      success: function(res) {
        console.log("key=", res.keys)
        console.log("currentSize=", res.currentSize)
        console.log("limitSize=", res.limitSize)
      },
    })
    // if (msg!=undefined){
    //   wx.showToast({
    //     title: msg,
    //     icon:'none'
    //   })
    //   return
    // }
    // wx.redirectTo({
    //   url: '../index/index',
    // })
    // wx.switchTab({
    //   url: '../index/index',
    // })
  },
  gopay: function (event){
    console.log(event)
    wx.scanCode({
      onlyFromCamera:false,
      scanType: ['qrCode','barCode'],
      success:function(res){
        console.log("gopay->success")
        console.log(res)
        var result=res.result
        
      },
      fail:function(res){
        console.log("gopay->fail")
        console.log(res)
      }
    })

  },
  getPhoneNumber:function(event){
    console.log(event)
  },

  clickVerify:function(event){
    var that = this;
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show)  //false
    })
    settime(that);
  }
})

function verfyLoginData(phone,code){
  var errMsg=undefined
  if (phone === undefined || phone.length<11){
    errMsg="请输入正确的手机号！"
  } else if (code === undefined || code.length <6){
    errMsg = "请输入正确的验证码！"
  }
  return errMsg
}