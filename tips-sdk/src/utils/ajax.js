function getRequest() {
  let req;
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else {
    req = new ActiveXObject('Microsoft.XMLHTTP');
  }
  return req;
}

function ajax(url, method, reqData, successCallback, errorCallback) {
  const req = getRequest();
  if (req !== null) {
    req.open(method, url, true);
    if (method === 'POST') {
      req.setRequestHeader('Content-type', 'application/json');
    }
    if (method === 'GET') {
      req.send();
    } else {
      req.send(reqData);
    }
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status === 200) {
        successCallback(req);
      } else if (req.status !== 200 && !errorCallback) {
        throw new Error('网络请求失败');
      } else if (req.status !== 200 && errorCallback) {
        errorCallback(req);
      }
    };
  }
}

export default ajax;
