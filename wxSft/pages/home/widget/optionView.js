// pages/home/widget/optionView.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    optModels: {
      type: Array,
      value: []
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
    itemClick:function(event){
      console.log('optItemClick-->')
      console.log(event)
      var obj = event.currentTarget.dataset.obj
      this.triggerEvent('OnOptItemClick', obj)
    }
  }
})
