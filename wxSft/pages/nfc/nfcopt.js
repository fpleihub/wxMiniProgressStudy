// pages/nfc/nfcopt.js
var app = getApp()
var comm = require('../../utils/comm_util.js')
var NfcHCECore = require('../../utils/nfc_hce_core.js')
var aids = ['F223344556']
var msg = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearching: false,
    _hasinnt: false,
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var barinyv = comm.hex2bariny('0e')
    // console.log('barinyv=', barinyv)
    // console.log(comm.bariny2Ten(barinyv))
    
    this.nfcHCECore = new NfcHCECore(this, aids, this.onOptMessageCallBack.bind(this), this.onHCEMessageCallBack.bind(this))
    console.log("-->initNFCHCE")
    this.nfcHCECore.simple()
  },
  /**
   * hce操作相关回调
   */
  onOptMessageCallBack(code, _msg) {
    console.log('onOptMessageCallBack')
    if (code===0){
      console.log("执行成功！")
    }else{
      msg = msg + '执行失败code=' + code + ",msg=" + _msg+ '\n'
    }
    this.setData({
      content: msg
    })
  },
  /**
   * 收到读卡器发送指令
   */
  onHCEMessageCallBack(messageType, reason, hexData) {
    var that=this
    console.log('onHCEMessageCallBack')
    console.log("有读卡器读我,messageType=", messageType)
    if (messageType === 1) {
      msg = msg + "有读卡器读我,数据包:" + hexData + '\n'
      that.setData({
        content: msg
      })
      console.log('向读卡器发送apdu')
      //C-APDU,协定 statuCode=9000为成功
      var selectresult = '00A404009F02000000809F03000000005F2A00569000'
      // var byteArrays = comm.hex2Bytes(selectresult)
      // console.log(byteArrays.length)
      // var retbuffer = new ArrayBuffer(byteArrays.length)
      // var dataView = new DataView(retbuffer)
      // for (var i = 0; i < dataView.byteLength; i++) {
      //   dataView.setInt8(i, byteArrays[i])
      // }
      msg = msg + "返回指令：" + selectresult + '\n'
      that.setData({
        content: msg
      })
      that.nfcHCECore.sendNfcHCEMessage(selectresult)
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

  },
  startHCEOpt(event) {

  },
  stopHCEOpt(event) {
    _stopHCE()
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
