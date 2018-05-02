// pages/wifi/wifi.js
const codes=[
  { 'code': '12000', msg: '未先调用startWifi接口' },
  { 'code': '12001', msg: '当前系统不支持相关能力' },
  { 'code': '12002', msg: 'Wi-Fi 密码错误' },
  { 'code': '12003', msg: '连接超时' },
  { 'code': '12004', msg: '重复连接 Wi-Fi' },
  { 'code': '12005', msg: 'Android特有，未打开 Wi-Fi 开关' },
  { 'code': '12006', msg: 'Android特有，未打开 GPS 定位开关' },
  { 'code': '12007', msg: '用户拒绝授权链接 Wi-Fi' },
  { 'code': '12008', msg: '无效SSID' },
  { 'code': '12010', msg: '系统其他错误' },
  { 'code': '12011', msg: '应用在后台无法配置 Wi-Fi' },
  { 'code': '12012', msg: '请给予应有GPS定位权限'},
  { 'code': '12009', msg: '系统运营商配置拒绝连接 Wi-Fi' },
]
function getErrorMsgWithCode(errorCode){
  var msg=''
  for (var i = 0; i < codes.length; i++) {
    var obj = codes[i]
    if (obj.code == errorCode) {
      msg = obj.msg
      break
    }
  }
  return msg
}
var _initflag=false;
var timer=null
var _animation = wx.createAnimation({
  duration: 200,
  timingFunction: 'linear',
  delay: 0,
  transformOrigin: "50% 50%",
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:false,
    isSearching:false,
    wifiLists: [],
    wifiObject:{},
    animationData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startWifi({
      success: function (info) {
        console.log(info)
        console.log('initWifi->success')
        _initflag = true

      },
      fail: function (error) {
        console.log(error)
        wx.showToast({
          title: getErrorMsgWithCode(error.errCode),
          icon: 'none'
        })
        _initflag = false;
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
  
  findWifi(event){
    var context=this
    wx.showNavigationBarLoading()
    //每隔3000毫秒扫描一次
    timer = setInterval(function () {
      fondwifilist(context)
    }, 3000)
  },
  //列表自定义点击
  onItemClick(event){
    console.log("自定义组件item点击")
    console.log(event)
    var flag = event.detail.secure
    var pwd=''
    var ssid = event.detail.ssid
    var bssid = event.detail.bssid
    console.log('key-bssid:' + bssid)
    var wifiObject = wx.getStorageSync(bssid)
    console.log('wifiObject->',wifiObject)
    if (wifiObject != null && wifiObject.ssid!=undefined) {
      console.log("该wifi已经连接过,不需要再次输入密码")
      pwd = wifiObject.pwd
      console.log("pwd=" + pwd)
      flag=false;
    }
    if (flag){
      console.log("该wifi需要密码")
      this.data.wifiObject.ssid = ssid
      this.data.wifiObject.bssid = bssid
      this.animation = _animation
      _animation.scale(1, 1).step()
      this.setData({
        animationData: _animation.export(),
        wifiObject: this.data.wifiObject,
        showModalStatus: true
      })
    }else{
      conn2wifi(event.detail.ssid, event.detail.bssid, pwd)
    }
   
  },
  
  stopWifi:function(event){
    clearInterval(timer)
    wx.hideNavigationBarLoading()
    wx.stopWifi({
      success:function(info){
        console.log(info)
        console.log('stopWifi->success')
      },
      fail:function(error){
        console.log(error)
      }
    })
    wx.navigateBack({
      
    })
  },
  _close:function(){
    this.animation = _animation;
    _animation.scale(-1, -1).step()
    this.setData({
      animationData: _animation.export(),
      showModalStatus: false
    })
  },
  wifipwdinput:function(event){
    console.log('wifipwdinput:',event)
    this.data.wifiObject.pwd=event.detail.value
    this.setData({
      wifiObject: this.data.wifiObject
    })
  },
  connectwifiClick:function(event){
    this.animation = _animation;
    _animation.scale(0, 0).step()
    this.setData({
      animationData: _animation.export(),
      showModalStatus: false
    })
    if (this.data.wifiObject.pwd.length>0){
      conn2wifi(this.data.wifiObject.ssid, this.data.wifiObject.bssid, this.data.wifiObject.pwd)
    }else{
      wx.showToast({
        title: '请输入wifi密码！',
        icon:'none'
      })
    }
  },
  /**
   * 扫描二维码连接自动wifi
   */
  scannQrCodeWifi:function(event){
    wx.getConnectedWifi({
      success:function(res){
        Console.length('scannQrCodeWifi->',res)
      }
    })
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: function (res) {
        console.log("scannQrCodeWifi->success")
        console.log(res)
        var result = res.result
        wx.showModal({
          title: 'Tip',
          content: "WIFI信息：\n"+result,
        })
      },
      fail: function (res) {
        console.log("gopay->fail")
        console.log(res)
        wx.showToast({
          title: '未识别二维码信息！',
        })
      }
    })
  }
})

function fondwifilist(context){
  console.log("--fondwifilist--")
  wx.showNavigationBarLoading()
  context.setData({
    isSearching: true,
  })
  wx.getWifiList({
    success: function (info) {
      console.log("getWifiList->success")
      console.log(info)
      wx.onGetWifiList(function (res) {
        console.log("onGetWifiList")

        var list = res.wifiList
        console.log(list)
        for (var i = 0; i < list.length; i++) {
          var obj = list[i]
          var ssid = obj.SSID
          var bssid = obj.BSSID
          var secure = obj.secure //Wi-Fi 是否安全
          var strength = obj.signalStrength //Wi-Fi 信号强度
          if (ssid.length <= 0) {
            ssid = bssid
          }
          var flag = false;
          context.data.wifiLists.forEach(function (value, index, list) {
            if (bssid == value.bssid) {
              flag = true
              return false
            }
          })
          if (!flag) {
            var temp = { 'ssid': ssid, 'bssid': bssid, 'secure': secure, 'strength': strength }
            context.data.wifiLists.push(temp)
          }
        }
        context.setData({
          wifiLists: context.data.wifiLists
        })
        context.setData({
          isSearching: false
        })
        wx.hideNavigationBarLoading()
      })
    },
    //如果没有打开wifi调用返回会返回错误
    fail: function (error) {
      console.log("getWifiList->fail")
      console.log(error)
      var msg = getErrorMsgWithCode(error.errCode)
      wx.showModal({
        title: 'Error',
        content: msg,
        showCancel: false,
      })
      wx.hideNavigationBarLoading()
    }
  })
}

//连接wifi
function conn2wifi(ssid, bssid,_pwd) {
  console.log('connWifiInfo->', { 'ssid': ssid, 'bssid': bssid, 'pwd': _pwd })
  clearInterval(timer)
  wx.hideNavigationBarLoading()
  wx.connectWifi({
    SSID: ssid,
    BSSID: bssid,
    password: _pwd,
    success: function (res) {
      console.log(res)
      console.log("连接成功")
      //储存起来，以wifi的bissd为key
      wx.setStorageSync(bssid, { 'ssid': ssid, 'bssid': bssid, 'pwd': _pwd})
      wx.showToast({
        title: ssid+'连接成功，可以为所欲为啦！',
        icon:'none',
        duration:3000
      })
      wx.navigateTo({
        url: '../web/html?url=http://www.zhgov.com/webnews/465.html',
      })
    },
    fail: function (error) {
      console.log(error)
      console.log("连接失败")
      var code = error.errCode
      var msg = error.errMsg
      // msg = getErrorMsgWithCode(code)
      wx.showModal({
        title: 'Error',
        content: msg + '[' + code + ']',
        confirmText: 'ok',
        success: function (info) {

        }
      })
    }
  })
  wx.onWifiConnected(function (res) {
    var wifi = res.wifi
    console.log('wifi连接成功:')
    console.log(wifi)
  })
}
