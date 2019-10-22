import Ajax from '../utils/ajax';
import Utils from '../utils';
import Config from '../config';
import InitTagAndCss from '../common/initTagAndCss';
import Switch from '../common/switch';
import Tips from '../tips';
import Core from '../core';

class ContentRequest {

  constructor() {
    this.serviceName = '';
    this.initServiceName();
  }

  initServiceName() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var service = scripts[i].getAttribute('data-service'); // 获得系统名称
      if (service) {
        this.serviceName = service;
        break;
      }
    }
  }

  // 从服务端获得提示内容
  initTipsContent() {
    const url = `${Config.server}/v1/api/tips?systemName=${this.serviceName}`;
    Ajax(url, 'GET', null, this.initTipsCallback.bind(this));
  }

  // 文案信息
  initDocumentContent() {
    const url = `${Config.server}/v1/api/documents?systemName=${this.serviceName}`;
    Ajax(url, 'GET', null, this.initDocumentCallback.bind(this));
  }

  // 用户权限
  initUserPerm(username) {
    const url = `${Config.server}/v1/api/perm?systemName=${this.serviceName}&currentUsername=${username}`;
    Ajax(url, 'GET', null, (req) => {
      try {
        const result = JSON.parse(req.responseText);
        if (result && result.code === 200 && result.data) {
          // 设置编辑权限
          Config.perm = result.data;
          Switch.setSwitch();
        }
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  // 初始化提示内容
  initTipsCallback(req) {
    try {
      const result = JSON.parse(req.responseText);
      if (result.code === 200 && result.data && result.data.tipList) {
        const tipList = result.data.tipList;
        const list = [];
        tipList.forEach(function (item) {
          if (item.status === 0) {
            if (item.createDate && item.tipType === 'pop' && item.interval) { // 带有周期的pop提示
              const thatDay = new Date(item.createDate).valueOf();
              const nowDay = new Date().valueOf();
              const subDays = parseInt((thatDay - nowDay) / 1000 / 60 / 60 / 24);
              if (subDays === 0 || subDays / item.interval === parseInt(subDays / item.interval)) {
                item.isPop = true;
              }
            }
            list.push(item);
          }
        });
        const systemInfo = result.data.systemInfo;
        const pathname = Utils.getPathname();
        InitTagAndCss.initCssStyle();
        InitTagAndCss.initTipsTag(systemInfo);
        Core.prePathname = pathname;
        Core.tipsOriginData = Core.tipsOriginData.concat(list);
        Core.systemInfo = systemInfo;
        Tips.addMouseEventByTooltip();
        Core.getTipsDataByRouter(pathname); // 获得路由对应的提示数据
        Core.addTips(); // 添加pop提示和为悬浮提示绑定事件
        Core.observerUIChange(); // 监听dom的变化，dom变化后重新绑定事件
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  // 初始化文案信息
  initDocumentCallback(req) {
    try {
      const result = JSON.parse(req.responseText);
      const host = window.location.host;
      if (result.code === 200 && result.data && result.data && result.data.systemInfo) {
        if (host === result.data.systemInfo.domain) { // 判断是否是线上环境
          const documentList = result.data.documentList;
          const pathname = Utils.getPathname();
          Core.prePathname = pathname;
          Core.tipsOriginData = Core.tipsOriginData.concat(documentList);
          Core.getTipsDataByRouter(pathname); // 获得路由对应的提示数据
          Core.addTips(); // 添加pop提示和为悬浮提示绑定事件
        } else {
          const url = `${Config.server}/v1/api/document/list?systemName=${this.serviceName}`;
          // 非线上环境拿最新数据
          Ajax(url, 'GET', null, this.getDocumentList);
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  // 线下环境拿到的数据
  getDocumentList(req) {
    try {
      const result = JSON.parse(req.responseText);
      if (result.code === 200 && result.data && result.data.documentList && result.data.documentList.length > 0) {
        let documentList = result.data.documentList;
        documentList = documentList.filter(function (item) {
          return item.status === 0;
        });
        const pathname = Utils.getPathname();
        Core.prePathname = pathname;
        Core.tipsOriginData = Core.tipsOriginData.concat(documentList);
        Core.getTipsDataByRouter(pathname); // 获得路由对应的提示数据
        Core.addTips(); // 添加pop提示和为悬浮提示绑定事件
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new ContentRequest();
