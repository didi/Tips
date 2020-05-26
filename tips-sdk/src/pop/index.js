import Utils from '../utils';
import Config from '../config';

class Pop {
  constructor() {
    this.popFlag = false; // 判断当前是否有气泡提示，如果有就执行自动关闭函数
    this.popCount =  {}; // 为每个pop加个计数器，第一次弹出后就置为1，之后不再弹出
  }
  // 添加自动弹出tips
  setPopTips(elem, popId, data) {
    const pathname = Utils.getPathname();
    const time = window.localStorage.getItem(pathname + popId);
    if (data.isPop && time !== Utils.getTime()) {
      if (popId && data && !this.popCount[pathname + popId]) {
        this.popCount[pathname + popId] = 1;
        const offsetTop = elem.getBoundingClientRect().top + window.pageYOffset; // 获得元素到浏览器顶端的距离，加上页面卷起部分
        const offsetLeft = elem.getBoundingClientRect().left; // 获得元素到浏览器最左端的距离
        const thisWidth = elem.getBoundingClientRect().width; // 获得元素的宽度
        const thisHeight = elem.getBoundingClientRect().height; // 获得元素的高度
        if (data.title && data.content) {
          this.showPopTips(offsetLeft, thisWidth, offsetTop, thisHeight, popId, data);
          window.localStorage.setItem(pathname + popId, Utils.getTime()); // 存储弹出过气泡的标识
        }
        if (!this.popFlag) {
          this.popFlag = true;
        }
      }
      if (this.popFlag) { // 如果当前有气泡弹出，则在5秒后自动关闭
        this.autoClosePopOver();
      }
    }
  }

  // 初始化并展示弹出框提示
  showPopTips(offsetLeft, thisWidth, offsetTop, thisHeight, id, data) {
    const body = document.body;
    const popOver = document.createElement('div');
    const popTag = `<div class="dd-popover dd-popover-placement-${data.location} dd-popover-elem" id="dd-tip-pop-${id}" style="display: block;">
        <div class="dd-popover-content">
          <div class="dd-popover-arrow"></div>
          <div class="dd-popover-inner" style="max-width: 240px">
            <div>
              <div class="dd-popover-title">
                <span>${Utils.filterTag(data.title)}</span>
                <span data-tip-pop-close="${id}" style="display: inline-block; position: absolute; right: 10px; top: 4px; cursor: pointer">
                  <img src="${Config.closeImage}"/>
                </span>
              </div>
              <div class="dd-popover-inner-content">
                <div>${Utils.filterTag(data.content)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    popOver.innerHTML = popTag;
    body.appendChild(popOver);
    let left = 0, top = 0;
    const elem = document.getElementById(`dd-tip-pop-${id}`);
    // 判断pop的位置
    if (data.location === 'bottomLeft' || data.location === 'topLeft') {
      left = offsetLeft + thisWidth / 2 - 20;
    } else if (data.location === 'bottomRight' || data.location === 'topRight') {
      left = offsetLeft - (elem.getBoundingClientRect().width - thisWidth / 2 - 20);
    }
    if (data.location === 'topLeft' || data.location === 'topRight') {
      top = offsetTop - elem.getBoundingClientRect().height - 3;
    } else if (data.location === 'bottomLeft' || data.location === 'bottomRight') {
      top = offsetTop + thisHeight + 3;
    }
    elem.style.left = `${left}px`;
    elem.style.top = `${top}px`;
  }

  // 自动关闭popOver
  autoClosePopOver() {
    const timer = window.setTimeout( function () {
      const popOvers = document.querySelectorAll('.dd-popover-elem');
      for (let i = 0; i < popOvers.length; i++) {
        popOvers[i].parentNode.removeChild(popOvers[i]);
      }
      window.clearTimeout(timer);
      this.popFlag = false; // 重新置为false
    }, 8000);
  }
}

export default new Pop();
