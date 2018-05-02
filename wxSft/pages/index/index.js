//index.js
const model=require('model/IndexModel.js')
//引入图片预加载组件
const ImgLoader = require('../../utils/imageutils/img-loader.js')
//获取应用实例
const app = getApp()
let animationShowHeight = 300; 
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lists:[],
    animationData: "",
    showModalStatus: false,  
    selectItemIconUrl:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //初始化图片预加载组件，并指定统一的加载完成回调
    this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this))
    console.log(getApp().globalData.serviceHost)
  },
  //页面卸载监听,页面不可见应该停止网络请求
  onUnload:function(event){
    net.cancleReqest()
  },
  onHide:function(res){
    console.log("onHide")
  }
  ,
  onShow:function(event){
    console.log("onShow")
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight
      }
    }) 
    
    var that=this
    if (that.data.lists.length<=0){
      showProcessDialog()
      let params = new Map();
      params.set("sort", '-refresh_time')
      params.set("offset", 1)
      params.set("limit", 1)
      model.queryHrDatas(params,function(success){
        hideProcessDialog()
        console.log(success)
        var mlists=success.data.list
        mlists.forEach(function(value,index,list){
          value['loaded']=false
        
          that.data.lists.push(value)
        })
        that.setData({
          lists: that.data.lists
        })
        //同时对原图进行预加载，加载成功后再替换
        that.data.lists.forEach(item => {
          that.imgLoader.load(item.logo)
          console.log(item.logo)
        })
      },function(fail){
        hideProcessDialog()
        console.log(fail)
        showErrorTip(fail.statusCode, fail.errMsg)
      }) 
    }
  },
  //item点击
  itemClick:function(event){
    var obj=event.currentTarget.dataset.object
    console.log(obj)
    this.setData({
      selectItemIconUrl:obj.logo
    })
    var _animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
      delay: 0
    })
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
    // wx.makePhoneCall({
    //   phoneNumber: '13122619147',
    // })
  },
  //关闭
  _close: function (event){
    this.closeOptModal(event)
  },
  closeOptModal(opt){
    var value = opt.currentTarget.dataset.value
    // 隐藏遮罩层  
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    if (value == 'call-phone') {
      wx.makePhoneCall({
        phoneNumber: '13122619147',
      })
    }
  },
  //加载完成后的回调
  imageOnLoad(err, data) {
    console.log('图片加载完成', err, data.src)
    const imgList = this.data.lists.map(item => {
      if (item.logo == data.src)
        item.loaded = true
      return item
    })
    this.setData({ lists:imgList })
  },
  onPullDownRefresh: function () {
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },1000)
  }
})
function showProcessDialog(){
  wx.showLoading({
    title: '请稍等...',
  })
}
function hideProcessDialog(){
  wx.hideLoading()
}
function showErrorTip(code,msg){
  wx.showModal({
    title: 'Tip',
    content: '[' + code + ']' + msg,
    showCancel:false,
    confirmText:'ok'
  })
}