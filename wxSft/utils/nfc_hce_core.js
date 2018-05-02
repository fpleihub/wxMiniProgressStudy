var comm = require('comm_util.js')
function Action(){
  Action_GETHCESTATUS=0
  Action_STARTHCE=1
  Action_SENDMESSAGE=2
  Action_RECEIVEMESSAGE=3
  Action_STOPHCE=4
}
var Status=[
  {code:'0',msg:'OK'},
  { code: '13000', msg: '当前设备不支持 NFC' },
  { code: '13001', msg: '当前设备支持 NFC，但系统NFC开关未开启' },
  { code: '13002', msg: '当前设备支持 NFC，但不支持HCE' },
  { code: '13003', msg: 'AID 列表参数格式错误' },
  { code: '13004', msg: '未设置微信为默认NFC支付应用' },
  { code: '13005', msg: '返回的指令不合法' },
  { code: '13006', msg: '注册 AID 失败' }
]
class NfcHCECore{
  constructor(mContext,_aids,mMsgCallBack,onNfcMessageLinsener){
    this.context=mContext
    this.aids = _aids
    this.mCallBack = mMsgCallBack
    this.nfcMessageCallBack = onNfcMessageLinsener
  }
  /**
   * 获取当前状态
   */
  getNfcStatus(){
    var that=this
    wx.getHCEState({
      success:function(res){
        console.log('NfcHCECore-->getNfcStatus::success:',res)
        that._runCallBack(res.errCode, res.errMsg)
      },
      fail:function(err){
        console.error('NfcHCECore-->getNfcStatus::fail:', err)
        that.callError(err)
      }
    })
  }
  /**
   * 开启HCE环境
   */
  startNfcHCE(){
    var that = this
    wx.startHCE({
      aid_list: this.aids,
      success:function(res){
        console.log('NfcHCECore-->startNfcHCE::success:', res)
        that._runCallBack(res.errCode, res.errMsg)
      },
      fail:function(err){
        console.error('NfcHCECore-->startNfcHCE::fail:', err)
        that.callError(err)
      }
    })
  }
  /**
   * 发生消息
   */
  sendNfcHCEMessage(hexApdu){
    console.log('开始发送发回')
    var that = this
    var byteArrays = comm.hex2Bytes(hexApdu)
    console.log(byteArrays.length)
    var retbuffer = new ArrayBuffer(byteArrays.length)
    var dataView = new DataView(retbuffer)
    for (var i = 0; i < dataView.byteLength; i++) {
      dataView.setInt8(i, byteArrays[i])
    }
    wx.sendHCEMessage({
      data: retbuffer,
      success:function(res){
        console.log('NfcHCECore-->sendNfcHCEMessage::success:', res)
        that._runCallBack(res.errCode, res.errMsg)
      },
      fail:function(err){
        console.error('NfcHCECore-->sendNfcHCEMessage::fail:', err)
        that.callError(err)
      }
    })
  }
  /**
   * 收到读卡器发来的消息
   */
  onNfcHCEMessageHadnler(){
    var that = this
    wx.onHCEMessage(function(res){
      console.log('NfcHCECore-->onHCEMessage:', res)
      that.nfcMessageCallBack(res.messageType, res.reason, comm.ab2hex(res.data))
    })
  }
  /**
   * 停止HCE环境
   */
  stopNfcHCE(){
    var that = this
    wx.stopHCE({
      success:function(res){
        console.log('NfcHCECore-->stopNfcHCE::success:', res)
        that._runCallBack(res.errCode,res.errMsg)
      },
      fail:function(err){
        console.error('NfcHCECore-->stopNfcHCE::fail:', err)
        that.callError(err)
      }
    })
  }
  simple(){
    var that = this
    wx.getHCEState({
      success:function(res){
        console.log('NfcHCECore-->simple::getHCEState:', res)
        console.log(that.aids)
        that._runCallBack(res.errCode, res.errMsg)
        wx.startHCE({
          aid_list: that.aids,
          success:function(res){
            console.log('NfcHCECore-->simple::startHCE:', res)
            that._runCallBack(res.errCode, res.errMsg)
            wx.onHCEMessage(function(res){
              console.log('NfcHCECore-->simple::onHCEMessage:', res)
              that.nfcMessageCallBack(res.messageType, res.reason, comm.ab2hex(res.data))
            })
          },
          fail:function(err){
            that.callError(err)
          }
        })
      },
      fail:function(err){
        that.callError(err)
      }
    })
  }
  callError(err){
    var that=this
    Status.forEach(function (value, index, list) {
      if (value.code === err.errCode) {
        that._runCallBack(value, value.msg)
      }
    })
  }
  _runCallBack(status,data){
      this.mCallBack(status,data)
  }
}
module.exports = NfcHCECore