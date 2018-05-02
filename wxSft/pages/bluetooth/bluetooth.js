// pages/bluetooth/bluetooth.js
var comm=require('../../utils/comm_util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _isavailable:false,
    _isdiscovering:false,
    isSearching:false,
    _devices:[],
    _currentConnectedBluetooth:null
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initBluetooth()
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    addBluetoothChangeLinsener(this)
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
    closeBluetooth()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('刷新');
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
  searchBlutooth:function(event){
    var that=this
    that.setData({
      isSearching:true
    })
    //开始寻找
    wx.startBluetoothDevicesDiscovery({
      services: [],
      allowDuplicatesKey: false,
      success: function(res) {
        console.log("start search...")
        console.log(JSON.stringify(res))
        getBluetoothStatus()
        
      },
      fail:function(err){
        console.log(err)
      }
    })
    wx.onBluetoothDeviceFound(function(res){
      console.log("onBluetoothDeviceFound")
      console.log(res)
      var devices = res.devices
      devices.map((item) => {
        if (item.name != null && item.name.length > 0) {
          //nothing todo 
        } else {
          item.name = item.deviceId
        }
        that.data._devices.push(item)
        return item
      })
      that.setData({
        _devices: that.data._devices
      })
    })
    //获取列表
    wx.getBluetoothDevices({
      success: function (res) {
        var devices = es.devices
        devices.map((item) => {
          if (item.name != null && item.name.length > 0) {
            //nothing todo 
          } else {
            item.name = item.deviceId
          }
          return item
        })
        that.setData({
          _devices: devices
        })
      },
    })
    wx.getConnectedBluetoothDevices({
      services: ['v8'],
      success: function(res) {
        console.log("获取处于连接状态的设备", res);
        var deives = res.devices, flag = false, index = 0, conDevList = []
        deives.forEach(function (value, index, array) {
          if (value.name.indexOf('v8')!=-1){
            flag = true
            index += 1
            conDevList.push(value['deviceId'])
            that.deviceId = value['deviceId']
          }
        })
      },
      fail:function(err){
        
      }
    })
  },
  stopSearch:function(event){
    this.setData({
      isSearching: false
    })
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log("stopBluetoothDevicesDiscovery->"+res.errMsg)
      },
    })
  },
  //连接蓝牙
  conntBluetooth:function(event){
    
    var device=event.currentTarget.dataset.device
    console.log("正在连接："+device.deviceId)
    var uuid=device.advertisServiceUUIDs
    uuid=comm.ab2hex(uuid)
    console.log("uuid=", uuid)
    wx.showLoading({
      title: '连接:' + device.deviceId
    })
    wx.createBLEConnection({
      deviceId: device.deviceId,
      success: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: device.deviceId + "蓝牙连接成功",
          icon:'none'
        })
        wx.stopBluetoothDevicesDiscovery({
          success: function(res) {},
        })
      },
      fail:function(err){
        wx.hideLoading()
        wx.showToast({
          title: "连接失败："+err.errMsg,
          icon: 'none'
        })
        console.log(err)
      }
    })
  }
})
function initBluetooth(){
  wx.openBluetoothAdapter({
    success: function (res) {
      getBluetoothStatus()
    },
    fail: function (err) {
      console.log(err)
      console.log(err.errCode)
      if (err.errCode == '10001') {
        console.log("进来了")
        wx.showModal({
          title: 'Tip',
          content: '请先打开设备蓝牙开关！',
          showCancel: true,
          cancelText: '取消',
          confirmText: '已打开',
          success: function (info) {
            if (info.cancel) {
              wx.navigateBack({

              })
            }
            if (info.confirm) {
              getBluetoothStatus()
            }
          }
        })
      }
    }
  })
}
function closeBluetooth(){
  wx.closeBluetoothAdapter({
    success: function (res) {
      console.log("Bluetooth has close!")
    },
  })
}
function getBluetoothStatus() {
  wx.getBluetoothAdapterState({
    success: function (res) {
      console.log("getBluetoothAdapterState->success")
      console.log(res)
      if(!res.available){
        wx.showToast({
          title: '当前设备不可见，请确认蓝牙已经打开！',
          icon:'none'
        })
      }else{
        if(!res.discovering){
          wx.startBluetoothDevicesDiscovery({
            success: function(res) {},
          })

        }
      }
    },
    fail: function (err) {
      console.log(err)
    }
  })
}
function addBluetoothChangeLinsener(context){
  wx.onBluetoothAdapterStateChange(function(res){
    var msg=null
    context.setData({
      _isavailable: res.available,
      _isdiscovering:res.discovering
    })
    if(res.available){
      msg='错误:当前设备不可见！'
    }
    if(res.discovering){
      msg = '提示:当前设备处于搜索状态！'
    }
    if(msg!=null){
      wx.showToast({
        title: msg,
        icon:'none'
      })
    }
  })
}