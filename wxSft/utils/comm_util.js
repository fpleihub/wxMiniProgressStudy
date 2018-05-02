const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 生成指定长度随机数
 */
function genRandom(n) {
  let a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; //生成的随机数的集合  
  let res = [];
  for (let i = 0; i < n; i++) {
    let index = parseInt(Math.random() * (a.length));    //生成一个的随机索引，索引值的范围随数组a的长度而变化  
    res.push(a[index]);
    a.splice(index, 1)  //已选用的数，从数组a中移除， 实现去重复  
  }
  return res.join('');
} 
/**
    * 字符串转换为时间
    * @param  {String} src 字符串
    */
function strToDate(dateObj){
  dateObj = dateObj.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/')
  dateObj = dateObj.slice(0, dateObj.indexOf("."))
  return new Date(dateObj)
}
function isFunctinMethod(name) {
  if (name != undefined && typeof name === 'function') {
    return true
  }
  return false
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// ArrayBuffer转16进度字符串
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

//十六进制字符串转字节数组  
function hex2Bytes(str) {
  var pos = 0;
  var len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var hexA = new Array();

  for (var i = 0; i < len; i++) {
    var s = str.substr(pos, 2);
    var v = parseInt(s, 16);
    hexA.push(v);
    pos += 2;
  }
  return hexA;
}
function hex2ArrayBuffer(hex){
  var pos = 0;
  var len = hex.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var buffer = new ArrayBuffer(len)
  var dataview=new DataView(buffer)
  for (var i = 0; i < len; i++) {
    var s = hex.substr(pos, 2);
    var v = parseInt(s, 16);
    dataview.setInt16(i,v)
    pos += 2;
  }

  return buffer
}
/**
 * string转16进制
 */
function stringToHex(str) {
  var val = "";
  for (var i = 0; i < str.length; i++) {
    if (val == "")
      val = str.charCodeAt(i).toString(16);
    else
      val += str.charCodeAt(i).toString(16);
  }
  return val;
}
/**
 * 16进制转string
 */
function hexCharCodeToStr(hexCharCodeStr) {
  　　var trimedStr = hexCharCodeStr.trim();
  　　var rawStr =
    　　trimedStr.substr(0, 2).toLowerCase() === "0x"
      　　?
      　　trimedStr.substr(2)
      　　:
      　　trimedStr;
  　　var len = rawStr.length;
  　　if (len % 2 !== 0) {
    　　　　alert("Illegal Format ASCII Code!");
    　　　　return "";
  　　}
  　　var curCharCode;
  　　var resultStr = [];
  　　for (var i = 0; i < len; i = i + 2) {
    　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    　　　　resultStr.push(String.fromCharCode(curCharCode));
  　　}
  　　return resultStr.join("");
}

function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

function strToHexCharCode(str) {
  　　if (str === "")
    　　　　return "";
  　　var hexCharCode = [];
  　　hexCharCode.push("0x");
  　　for (var i = 0; i < str.length; i++) {
    　　　　hexCharCode.push((str.charCodeAt(i)).toString(16));
  　　}
  　　return hexCharCode.join("");
}
/**
 * string转byte数组
 */
function stringToByteArray(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  return bytes;
}
/**
 * byte数组转string
 */
function byteToString(bytearr) {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}
/**
 * 二进制转10
 */
function bariny2Ten(byte){

  return parseInt(byte, 2)
}
function bariny2Hex(a){
  return parseInt(a, 16)
}
/**
 * 10/16进制转2进制
 */
function ten2Bariny(ten){
  
  return ten.toString(2)
}
function str2Hex(str){
  return parseInt(str, 10).toString(16)
}
/**
 * 16进制转2进制
 */
function hex2bariny(hex){
  return parseInt(hex, 16).toString(2)
}
module.exports = {
  formatTime: formatTime,
  isFunctinMethod: isFunctinMethod,
  ab2hex: ab2hex,
  hex2Bytes: hex2Bytes,
  stringToByteArray: stringToByteArray,
  byteToString: byteToString,
  hex2ArrayBuffer: hex2ArrayBuffer,
  bariny2Ten: bariny2Ten,
  bariny2Hex: bariny2Hex,
  ten2Bariny: ten2Bariny,
  str2Hex: str2Hex,
  hex2bariny: hex2bariny,
  genRandom: genRandom,
  stringToHex: stringToHex,
  hexToString: hexCharCodeToStr,
  pad: pad
}
