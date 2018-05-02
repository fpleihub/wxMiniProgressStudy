// pages/hce/hcecard.js
var comm = require('../../utils/comm_util.js')
var NfcHCECore = require('../../utils/nfc_hce_core.js')
var app=getApp()
var msg=''
var countdown = 120;
var timer=null
var settime = function (that) {
  if (countdown == 0) {
    wx.navigateBack({
      
    })
    return;
  } else {
    that.setData({
      last_time: countdown
    })
    countdown--;
  }
  timer=setTimeout(function () {
    settime(that)
  }, 1000)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCard:null,
    content:'',
    last_time: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cardKey = options.cardkey
    var cardbean=wx.getStorageSync(cardKey)
    console.log('cardbean=' ,cardbean)
    this.setData({
      currentCard: cardbean
    })
    wx.setNavigationBarTitle({
      title: "门禁卡："+cardbean.cardName,
    })
    this.nfcHCECore = new NfcHCECore(this, [cardbean.AID], this.onOptMessageCallBack.bind(this), this.onHCEMessageCallBack.bind(this))
    console.log("-->initNFCHCE")
    this.nfcHCECore.simple()
  },

  /**
   * hce操作相关回调
   */
  onOptMessageCallBack(code, _msg) {
    console.log('onOptMessageCallBack')
    if (code === 0) {
      console.log("执行成功！", _msg)
    } else {
      msg = msg + '执行失败code=' + code + ",msg=" + _msg + '\n'
    }
    this.setData({
      content: msg
    })
    this.resetTime()
  },
  resetTime(){
    clearTimeout(timer)
    countdown=120
    this.setData({
      last_time:'120'
    })
    settime(this)
  },
  /**
   * 收到读卡器发送指令
   */
  onHCEMessageCallBack(messageType, reason, hexData) {
    var that = this
    console.log('onHCEMessageCallBack')
    console.log("有读卡器读我,messageType=", messageType)
    if (messageType == 1) {
      msg = msg + "有读卡器读我,数据包:" + hexData + '\n'
      that.setData({
        content: msg
      })
      this.sendDataPackage()
    }
    this.resetTime()
  },
  /**
   * 发送数据及包
   */
  sendDataPackage() {
    var cardbean = this.data.currentCard
    console.log(comm.pad(2, 2))
    //组装TLV数据包
    var header = '00A40400'

    var hexCardName = comm.stringToHex('yanglika')
    hexCardName = plusZero(hexCardName)
    console.log('补零：' + hexCardName)
    console.log('cardName=>', cardbean.cardName,';hexCardName=>' + hexCardName)
    console.log('还原xCardName:',comm.hexToString(hexCardName))
    var nameTag = '1F01'
    var len = comm.stringToHex(comm.pad((hexCardName.length / 2), 2))
    var cmdname = nameTag + len + hexCardName
    console.log('cmdname.TVL=>' + cmdname)

    var hexCardNo = comm.stringToHex(cardbean.cardNo)
    hexCardNo = plusZero(hexCardNo)
    console.log('cardNo=>', cardbean.cardNo,';hexCardNo=>' + hexCardNo)
    console.log('还原xCardNo:', comm.hexToString(hexCardNo))
    var noTag = '5F01'
    len = comm.stringToHex(comm.pad((hexCardNo.length / 2), 2))
    var cmdNo = noTag + len + hexCardNo
    console.log('cmdNo.TVL=>' + cmdNo)

    var hexCreateDate = comm.stringToHex(cardbean.createDate)
    hexCreateDate = plusZero(hexCreateDate)
    console.log('hexCreateDate=>' + hexCreateDate)
    var createDateTag = '5F02'
    len = comm.stringToHex(comm.pad((hexCreateDate.length / 2), 2))
    var cmdDate = createDateTag + len + hexCreateDate
    console.log('cmdDate.TVL=>' + cmdDate)

    var hexCardExp = comm.stringToHex(cardbean.cardExp)
    hexCardExp = plusZero(hexCardExp)
    console.log('hexCardExp=>' + hexCardExp)
    var hexCardExpTag = '9F01'
    len = comm.stringToHex(comm.pad((hexCardExp.length / 2), 2))
    var cmdExp = hexCardExpTag + len + hexCardExp
    console.log('cmdExp.TVL=>' + cmdExp)
    

    len = comm.stringToHex(((cmdname.length + cmdNo.length + cmdDate.length + cmdExp.length)/2).toString())
    
    console.log('len='+len)
    var status="9000"
    var sendcmd = (header + len + cmdname + cmdNo + cmdDate + cmdExp + status).toUpperCase()
    msg = msg + "卡片返回读卡器指令：" + sendcmd+ '\n'
    this.setData({
      content: msg
    })
    this.nfcHCECore.sendNfcHCEMessage(sendcmd)
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
    this.resetTime()
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
    this.resetTime()
    _stopHCE()
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

/**
 * 仅在安卓系统下有效。
 */
function _stopHCE() {
  console.log("-->stopHCE")
  wx.stopHCE({
    success: function (res) {
      console.log(res)
    },
    fail: function (err) {
      console.error(err)
    }
  })
}
//补零
function plusZero(_str) {
  while (_str.length % 2 != 0){
    _str += "0"
  }
  return _str
}
