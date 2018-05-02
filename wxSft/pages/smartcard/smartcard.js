// pages/smartcard/smartcard.js
//获取应用实例
var comm=require('../../utils/comm_util.js')
const app = getApp()
let animationShowHeight = 300; 
var _animation = wx.createAnimation({
  duration: 200,
  timingFunction: 'linear',
  delay: 0
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: "",
    showModalStatus: false,
    currentSeedId:''  ,
    currentCardName:'',
    currentExp:'',
    cards:[
      { '_type': 0, 'cardName': '样例卡', 'cardNo': 'N88888888', 'createDate': '20180309', 'cardExp': '291.50', 'AID': 'F223344556' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var c=this.data.cards[0]
    wx.setStorageSync(c.cardNo, c)
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
  addmengjing:function(event){
    console.log('添加智能卡片')
    genRandomSeed(this, 8)
    this.animation = _animation
    console.log('animationShowHeight=', animationShowHeight)
    _animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: _animation.export(),
      showModalStatus: true,
    })
    setTimeout(function () {
      _animation.translateY(0).step()
      this.setData({
        animationData: _animation.export()
      })
    }.bind(this), 200)
  },
  /**
   * 生成指定长度随机编号
   */
  genRandomSeed:function(event){
    genRandomSeed(this,8)
  },
  //关闭浮动窗
  _close: function (event) {
    this.closeOptModal()
  },
  closeOptModal() {
    this.animation = _animation;
    _animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: _animation.export(),
    })
    setTimeout(function () {
      _animation.translateY(0).step()
      this.setData({
        animationData: _animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 添加公交卡
   */
  addgongjiao:function(event){

  },
  /**
   * 卡信息输入
   */
  inputCardInfo:function(event){
    console.log(event)
    var inputType = event.currentTarget.dataset.inputtype
    var value=event.detail.value
    if (inputType ==='name'){
      this.setData({
        currentCardName: value
      })
    } else if (inputType === 'exdate'){
      this.setData({
        currentExp: value
      })
    }
  },

  /**
   * 添加
   */
  addCard:function(event){
    var currentSeedId=this.data.currentSeedId
    var currentCardName=this.data.currentCardName
    var currentExp=this.data.currentExp
    var msg=''
    if (currentCardName.length<=0){
      msg = '请输入卡名'
    }
    if (currentExp.length<=0){
      msg = '请输入生效天数'
    }
    if(msg.length>0){
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    var cardbean = { '_type': 0, 'cardName': currentCardName, 'cardNo': currentSeedId, 'createDate': '20180309', 'cardExp': currentExp, 'AID': 'F223344556'}
    wx.setStorageSync(cardbean.cardNo, cardbean)
    this.data.cards.push(cardbean)
    this.setData({
      cards: this.data.cards
    })
    this.closeOptModal()
  },
  /**
   * 选择hce卡
   */
  emvcard:function(event){
    var card = event.currentTarget.dataset.cardbean
    console.log('card->', card)
    wx.navigateTo({
      url: '../hce/hcecard?cardkey=' + card.cardNo,
    })
  }
})
function genRandomSeed(context,length){
  var seed = "N"+comm.genRandom(length)
  console.log("seed=" + seed)
  context.setData({
    currentSeedId: seed
  })
}