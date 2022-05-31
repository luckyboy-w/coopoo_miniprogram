  const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
* 合并数组
*/
const SplitArray = function (list, sp) {
  if (typeof list != 'object') return [];
  if (sp === undefined) sp = [];
  for (var i = 0; i < list.length; i++) {
      sp.push(list[i]);
  }
  return sp;
}

const parseGetParams = function (url, obj) {
  let i = 0;
  let hasParam = false;
  if (url.indexOf("?") !== -1) {
    hasParam = true;
  }
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      continue;
    }
    if (i === 0 && !hasParam) {
      url += "?" + encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    } else {
      url += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    }
    i++;
  }
  return url;
}
/**
 * 对比数组
 * @param {数组A} listA 
 * @param {数组B} listB 
 */
const contrastArray = function (listA,listB) {

  let flag = true
    if (listA.length !== listB.length) {
      flag = false
    } else {
      listA.forEach(item => {
        if (listB.indexOf(item) === -1) {
          flag = false
        }
      })
    }

   return flag 
}
/*
* 订单状态转汉字
*/
const statusToText = function (status) {
  let statusName = '';
  let statusNum = Number(status);
  switch(statusNum) {
    case 0:
      statusName = '已取消';
      break;
    case 10:
      statusName = '待发货';
      break;
    case 20:
      statusName = '待收货';
      break;
    case 30:
      statusName = '待支付';
      break;
    case 40:
      statusName = '退货完成';
      break;
      case 41:
      statusName = '退货中';
      break;
    case 50:
      statusName = '交易完成';
      break;
    case 60:
      statusName = '待确认';
      break;
  }
  return statusName;
}
module.exports = {
  formatTime: formatTime,
  SplitArray: SplitArray,
  parseGetParams: parseGetParams,
  contrastArray: contrastArray,
  statusToText: statusToText
}
