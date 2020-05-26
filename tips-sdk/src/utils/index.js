// 工具函数
const Utils = {
  // 防抖函数
  debounce: function(method, delay) {
    let timer = null;
    return function () {
      const self = this;
      const args = arguments;
      timer && clearTimeout(timer);
      timer = setTimeout(function () {
        method.apply(self, args);
      }, delay);
    };
  },
  getTime: function() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  filterTag: function(xss) {
    var translateMap = { '<': '&lt;', '>': '&gt;' };
    return xss.replace(/<\/?(.*?)>/g, function(str, $1) {
      const targetString = $1.toLocaleLowerCase();
      if (targetString && targetString.indexOf('script') === -1 && targetString.indexOf('link') === -1) {
        return str;
      }
      return str.replace(/[<>]/g, function(str) {
        return translateMap[str];
      });
    });
  },
  // 获得页面的pathname
  getPathname: function() {
    let pathname;
    const href = window.location.href;
    if (href.indexOf('#') !== -1) { // 如果使用的是hashchange api
      const pathQuery = href.split('#')[1]; // 取#之后的部分
      pathname = pathQuery.split('?')[0]; // 取pathname
    } else {
      pathname = window.location.pathname;
    }
    return pathname;
  },
};

export default Utils;
