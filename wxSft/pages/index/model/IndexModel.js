/**
 * 首页网络数据模块
 */
const net = require('../../../utils/network.js')
const hr_searcher = 'https://webapi.tianjihr.com/position/searcher'
const query_versio = 'https://safepay.handpay.cn/hpayMicroView/zztNewVerifyVersion.do'
/**
 * 查询河南hr数据库
 */
function queryHrDatas(params,successCallBack,failCallBack){
  net.requestGet(hr_searcher, params, successCallBack, failCallBack)
}
/**
 * 查询更新
 */
function queryVersion(params, successCallBack, failCallBack){
  net.requestPost(query_versio, params, successCallBack, failCallBack)
}
module.exports = {
  queryHrDatas: queryHrDatas,
  queryVersion: queryVersion,
}
