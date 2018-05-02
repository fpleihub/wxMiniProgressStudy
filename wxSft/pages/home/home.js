// pages/home/home.js
var net =require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[
      { id: 0, imageurl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1368896861,1964656290&fm=27&gp=0.jpg', mtype:1, targeturl:"", des:''},
    ],
    opts:[
      [
        { id: 0, title: 'A', icon: '../../../images/icons/loan_icon.png', page: ''}, 
        { id: 1, title: 'B', icon: '../../../images/icons/icon_my_cards_hover.png', page: ''},
        { id: 2, title: 'C', icon: '../../../images/icons/new_home_zhanwu.png', page: ''}, 
        { id: 3, title: 'D', icon: '../../../images/icons/new_home_querymoney.png', page: ''}
      ],
      [
        { id: 4, title: 'wifi连接', icon: '../../../images/icons/new_home_notice_hover.png', page: '../wifi/wifi'}, 
        { id: 5, title: 'HCE测试', icon: '../../../images/icons/icon_gflc.png', page: '../nfc/nfcopt'}, 
        { id: 6, title: '智能卡片', icon: '../../../images/icons/new_home_nfcread.png', page: '../smartcard/smartcard'}, 
        { id: 7, title: '蓝牙连接', icon: '../../../images/icons/icon_my_quota.png', page: '../bluetooth/bluetooth'}],
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that=this
    var host ="http://10.148.21.126:8080/client/bannerApi_queryBanners.do"
    var map=new Map()
    map.set("mtype","1")
    net.requestGet(host,map,function(res){
      console.log("success:",res)
      var code=res.code
      var errMsg =res.errMsg
      var list=res.data.data
      if (list.length>0){
        that.setData({
          banners: list
        })
      }else{
        wx.showToast({
          title: 'banner数据获取失败',
          icon:'none',
          duration:4000
        })
      }
    },function(fail){
      console.log("fail:", fail)
      wx.showToast({
        title: fail.errMsg,
        icon: 'none',
        duration: 3000
      })
    })
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
  bannerClick(event){
    console.log(event)
    var clickItemId=event.currentTarget.dataset.id
    wx.showToast({
      title: 'clickItemId=' + clickItemId,
      icon:'none'
    })
  },
  OnOptItemClick(event){
    console.log(event)
    var clickId=event.detail.id
    var clickTitle=event.detail.title
    var clickPageUrl = event.detail.page
    if (clickPageUrl != null && clickPageUrl.length>0){
      wx.navigateTo({
        url: clickPageUrl,
      })
    }else{
      wx.showToast({
        title: '功能暂未开放！',
        icon:'none'
      })
    }
  }
})