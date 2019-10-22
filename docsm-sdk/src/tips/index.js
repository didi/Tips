import Utils from '../utils';

class Tips {
  constructor() {
    this.timer = null;
  }

  setToolTips(elem, tipId, data) {
    const _this = this;
    if (!elem.onmouseenter) { // 防止重复绑定
      (function (tipId, data) {
        elem.onmouseenter = Utils.debounce(function (e) {
          clearTimeout(_this.timer);
          const target = e.target;
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset; // 获得元素到浏览器顶端的距离，加上页面卷起部分
          const offsetLeft = target.getBoundingClientRect().left; // 获得元素到浏览器最左端的距离
          const thisWidth = target.getBoundingClientRect().width; // 获得元素的宽度
          const thisHeight = target.getBoundingClientRect().height; // 获得元素的高度
          _this.showToolTips(tipId, offsetLeft, offsetTop, thisWidth, thisHeight, data);
        }, 200);

        elem.onmouseleave = Utils.debounce(function () {
          _this.hideTooltipsByDelay();
        }, 200);
      })(tipId, data);
    }
  }

  // 显示tooltips，设置内容和位置
  showToolTips(tipId, offsetLeft, offsetTop, thisWidth, thisHeight, data) {
    const containerClassName = 'dd-tooltip';
    const titleClassName = 'dd-tooltip-inner-title';
    const contentClassName = 'dd-tooltip-inner-content';
    const topClassName ='dd-tooltip-placement-top';
    const bottomClassName = 'dd-tooltip-placement-bottom';
    const leftClassName = 'dd-tooltip-placement-left';
    const rightClassName = 'dd-tooltip-placement-right';
    const titleSize = this.systemInfo && this.systemInfo.titleSize ? Number(this.systemInfo.titleSize) : 0;
    const tipsElem = document.querySelector(`.${containerClassName}`);
    const title = document.querySelector(`.${titleClassName}`);
    const content = document.querySelector(`.${contentClassName}`);
    title.style.display = 'none';
    content.style.display = 'none';
    // 设置提示标题
    if (data.title && data.title.length > titleSize) {
      title.innerHTML = Utils.filterTag(data.title);
      title.style.display = 'block';
    }
    if (data.content) {
      content.innerHTML = Utils.filterTag(data.content);
      content.style.display = 'block';
    }
    if (data.title && data.content && data.title.length > titleSize) {
      title.style.borderBottomLeftRadius = '0px';
      title.style.borderBottomRightRadius = '0px';
      content.style.borderTopLeftRadius = '0px';
      content.style.borderTopRightRadius = '0px';
    }
    let tipsWidth, tipsHeight; // 间隙的距离
    let top, left;
    tipsElem.style.display = 'block';
    // 计算tips的位置
    if (data.location === 'bottom') {
      tipsElem.className = `${containerClassName} ${bottomClassName}`;
      tipsWidth = tipsElem.getBoundingClientRect().width; // 必须先设为可见，才能获取width
      top = offsetTop + thisHeight;
      left = offsetLeft + thisWidth / 2 - tipsWidth / 2;
    } else if (data.location === 'left') {
      tipsElem.className = `${containerClassName} ${leftClassName}`;
      tipsWidth = tipsElem.getBoundingClientRect().width; // 必须先设为可见，才能获取width
      tipsHeight = tipsElem.getBoundingClientRect().height;
      top = offsetTop - (tipsHeight - thisHeight) / 2;
      left = offsetLeft - tipsWidth;
    } else if (data.location === 'right') {
      tipsElem.className = `${containerClassName} ${rightClassName}`;
      tipsHeight = tipsElem.getBoundingClientRect().height;
      top = offsetTop - (tipsHeight - thisHeight) / 2;
      left = offsetLeft + thisWidth;
    } else {
      tipsElem.className = `${containerClassName} ${topClassName}`;
      tipsWidth = tipsElem.getBoundingClientRect().width; // 必须先设为可见，才能获取width
      tipsHeight = tipsElem.getBoundingClientRect().height;
      top = offsetTop - tipsHeight - 5;
      left = offsetLeft + thisWidth / 2 - tipsWidth / 2;
    }
    // 判断tips在浏览器的左边和右边的边缘位置
    const screenWidth = window.screen.width;
    if (left < 0) {
      left = 0;
    } else if (left + thisWidth > screenWidth) {
      left = screenWidth - thisWidth;
    }
    tipsElem.style.top = `${top}px`;
    tipsElem.style.left = `${left}px`;
  }
  // 隐藏tooltips
  hideToolTips() {
    const containerClassName = 'dd-tooltip';
    const tipsElem = document.querySelector(`.${containerClassName}`);
    tipsElem.style.display = 'none';
  }
  // 隐藏之前加延迟
  hideTooltipsByDelay() {
    const _this = this;
    clearTimeout(_this.timer);
    _this.timer = setTimeout(function () { // 加个延迟，鼠标移开500ms内展示tips
      _this.hideToolTips();
    }, 300);
  }

  // 为tooltip添加onmouseenter和onmouseleave事件
  addMouseEventByTooltip() {
    const containerClassName = 'dd-tooltip';
    const tipsElem = document.querySelector(`.${containerClassName}`);
    const _this = this;
    tipsElem.onmouseenter = Utils.debounce(function (e) {
      clearTimeout(_this.timer);
      const target = e.target;
      target.style.display = 'block';
    }, 200);
    tipsElem.onmouseleave = Utils.debounce(function () {
      _this.hideTooltipsByDelay();
    }, 200);
  }

  // 对所有tips的onmouseenter和onmouseleave事件进行解绑
  clearEventListener() {
    const all = document.body.querySelectorAll('[data-tip-id]');
    for (let i = 0; i < all.length; i++) {
      all[i].onmouseenter = null;
      all[i].onmouseleave = null;
    }
  }
}

export default new Tips();

