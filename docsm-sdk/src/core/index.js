import Tips from '../tips';
import Pop from '../pop';
import Document from '../document';
import EditBtn from '../common/editBtn';
import Utils from '../utils';
import Config from '../config';

class Core {
  constructor() {
    this.tipsData = {}; // 每个路由所对应的提示信息
    this.prePathname = '';
    this.tipsOriginData = [];
    this.systemInfo = {};
  }

  observerUIChange() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const list = document.querySelector('body');
    const _this = this;
    const observer = new MutationObserver(function(mutations) {
      if (mutations.length < 10) { // 如果dom变更的length < 10，则判断是否需要重新扫描
        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].target && mutations[i].target.innerHTML) {
            const htmlStr = mutations[i].target.innerHTML;
            const attr = mutations[i].target.getAttribute ? mutations[i].target.getAttribute('data-tip-id') : '';
            if (htmlStr.indexOf('data-tip-id') > -1 || attr) {
              _this.addTipsAndEditbtn();
              break;
            }
          }
        }
      } else { // 如果dom变更的length > 10，则直接重新扫
        _this.addTipsAndEditbtn();
      }
      _this.change();
    });
    observer.observe(list, {
      childList: true,
      subtree: true, // 必须为true
      attributes: true,
    });
  }

  getTipsDataByRouter(pathname) {
    const list = this.tipsOriginData;
    const tips = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].router === pathname) {
        if (!tips[list[i].id]) {
          tips[list[i].id] = [];
        }
        if (list[i].tipType === 'doc') {
          list[i].content = list[i][`${Config.language}_content`] ||  list[i]['en_US_content'];
        } else {
          list[i].content = !list[i][`${Config.language}_content`] && !list[i][`${Config.language}_title`] ? list[i]['en_US_content'] : list[i][`${Config.language}_content`];
          list[i].title = !list[i][`${Config.language}_content`] && !list[i][`${Config.language}_title`] ? list[i]['en_US_title'] : list[i][`${Config.language}_title`];
        }
        tips[list[i].id].push(list[i]);
      }
    }
    this.tipsData = tips;
  }

  // 添加tips
  addTips() {
    const all = document.body.querySelectorAll('[data-tip-id]');
    for (let i = 0; i < all.length; i++) {
      const tipId = all[i].getAttribute('data-tip-id');
      if (this.tipsData[tipId]) {
        const data = this.tipsData[tipId];
        for (let j = 0; j < data.length; j++) {
          if (data[j].tipType === 'tip') {
            Tips.setToolTips(all[i], tipId, data[j]); // 绑定事件
          } else if (data[j].tipType === 'pop') {
            Pop.setPopTips(all[i], tipId, data[j]);
          } else if (data[j].tipType === 'doc') {
            Document.setDocument(all[i], tipId, data[j]);
          }
        }
      }
    }
  }

  addTipsAndEditbtn() {
    const switchStatus = window.sessionStorage.getItem('switch');
    this.addTips();
    if (Config.perm && switchStatus === 'open') {
      EditBtn.addEditBtn();
    }
  }

  change(language) { // 监听路由的变化
    const pathname = Utils.getPathname();
    if (this.prePathname !== pathname || (language && this.language !== language)) { // 路由变化后或语言变化后 清空当前的标志，从新开始
      this.prePathname = pathname;
      Config.language = language ? language : Config.language;
      EditBtn.editBtnCount = {};
      var popOvers = document.querySelectorAll('.dd-popover-elem');
      for (let i = 0; i < popOvers.length; i++) {
        popOvers[i].parentNode.removeChild(popOvers[i]);
      }
      this.tipsData = {};
      Tips.clearEventListener(); // 清空所有的事件绑定
      Tips.hideToolTips();
      this.getTipsDataByRouter(pathname);
      this.addTipsAndEditbtn(); // 重新绑定，路由改变和ui变化都是异步的，所以得在路由变化后重新绑定
    }
  }
}

export default new Core();

