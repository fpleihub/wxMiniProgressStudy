// pages/wifi/customView/listView.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showLine:{
      type:Boolean,
      value:true
    },
    lists:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //item点击事件需要传递给引用者
    itemClick: function (event){
      console.log('itemClick-->')
      console.log(event)
      var ssid = event.currentTarget.dataset.ssid
      var bssid = event.currentTarget.dataset.bssid
      var secure = event.currentTarget.dataset.secure
      var data = { 'ssid': ssid, 'bssid': bssid, 'secure': secure}
      this.triggerEvent('OnItemClick', data)
    },
  }
})
