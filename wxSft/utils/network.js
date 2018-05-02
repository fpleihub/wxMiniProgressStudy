/**
 * 网络请求处理
 */
var _json=require('json_helper.js')
var comm=require('comm_util.js')
const SUCCESS_STATUS=200
var requestTask =null
var app=getApp()
/**
 * 构建请求头
 */
function buildHttpHeader(){
  var header={
    'content-type': 'application/json',
  }
  return header
}
/**
 * 开始请求
 */
function request(url, map_params, methodType, success, fail){
  var _data = _json.stringToJson(_json.mapToJson(map_params))
  console.log('_data:', _data)
  requestTask=wx.request({
    url: url,
    method: methodType,
    data: _data,
    success: function (response) {
      //{data: {…}, header: {…}, statusCode: 405, errMsg: "request:ok"}
      if (app.globalData.debug){
        console.log("networks-->request-->success")
        console.log(response)
      }
      if (response.statusCode == SUCCESS_STATUS) {
        if (comm.isFunctinMethod(success)) {
          success(response)
        } else {
          console.error("_post(.,.,success,.) success is not callback function!")
        }
      } else {
        var failInfo = { "statusCode": response.statusCode, "errMsg": response.data.Message }
        if (comm.isFunctinMethod(fail)) {
          fail(failInfo)
        } else {
          console.error("_post(.,.,.,fail) fail is not callback function!")
        }
      }
    },
    fail: function (error) {
      if (app.globalData.debug) {
        console.log("networks-->request-->fail")
        console.log(error)
      }
      if (comm.isFunctinMethod(fail)) {
        fail(error)
      }
    },
    complete:function(){
      requestTask=null
    }
  })
}
/**
 * 取消请求
 */
function _cancleReqest(){
  if (requestTask!=null){
    requestTask.abort()
  }
}
/**
 * post请求。
 * url:请求地址。
 * map_params：请求参数，map数据格式。
 * success：成功回调（数据正常，状态为200才回调）。
 * fail：失败或者错误回调（状态 200以外或者网络错误）。
 */
function _post(url,map_params,success,fail){
  request(url, map_params,"POST",success,fail)
}
/**
 * get请求
 */
function _get(url, map_params, success, fail){
  request(url, map_params, "GET", success, fail)
}
//暴露方法
module.exports = {
  requestPost: _post,
  requestGet:_get,
  cancleReqest: _cancleReqest
}
