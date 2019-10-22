import ContentRequest from './request';
import EventProxy from './common/eventProxy';
import Notification from './utils/notification';
import Core from './core';
import Switch from './common/switch';
import Config from './config';

window.DocsM = {
  init(username, language) {
    if (language && language.indexOf('-') > -1) { // 兼容en-US这种
      language = language.replace(/-/g, '_');
    }
    Config.language = language ? language : 'zh_CN';
    Config.currentUsername = username;
    ContentRequest.initTipsContent(); // 从服务端拉下数据，在本地进行初始化
    ContentRequest.initUserPerm(username); // 给用户赋予权限
  },

  changeLanguage(language) { // 改变语言版本
    if (language && language.indexOf('-') > -1) { // 兼容en-US这种
      language = language.replace(/-/g, '_');
    }
    Core.change(language);
    Switch.setSwitch(); // 重新设置开关
  },

  setUserName(username) {
    if (username) {
      var systemInfo = this.systemInfo;
      var memberList = systemInfo.memberList;
      var usernameItems = systemInfo.creator;
      memberList.forEach(function (item) {
        if (item.username) {
          usernameItems += item.username;
        }
      });
      if (usernameItems.indexOf(username) > -1) {
        Config.perm = true;
        window.sessionStorage.setItem('switch', 'open');
        Switch.setSwitch(); // 重新设置开关
      }
    }
  },
};

function renderDocsM () {
  Notification.initCssStyle(); // 初始化通知框的样式
  ContentRequest.initDocumentContent(); // 从服务端拉下数据，在本地进行初始化
  EventProxy.initEventProxy();
  if (window.dispatchEvent) { // 加载完了触发自定义函数
    window.document.dispatchEvent(new Event('DocsMSDKReady'));
  } else {
    window.document.fireEvent(new Event('DocsMSDKReady'));
  }
}


try {
  renderDocsM();
} catch(err) {
  throw new Error(err);
}

