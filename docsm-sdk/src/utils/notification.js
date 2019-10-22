// 成功失败提示框
const Notification = {
  cssArray: [
    `.dd-message-notice {
      padding: 8px;
      text-align: center;
    }`,

    `.dd-message-notice-content {
      display: inline-block;
      padding: 10px 16px;
      background: #fff;
      border-radius: 4px;
      -webkit-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: all;
    }`,

    `.dd-message .ddicon {
      position: relative;
      top: 1px;
      margin-right: 8px;
      font-size: 16px;
    }`,

    `.dd-message-success .ddicon {
      color: #52c41a;
    }`,

    `.dd-message-error .ddicon {
      color: #f5222d;
    }`,

    `.ddicon {
      display: inline-block;
      color: inherit;
      font-style: normal;
      line-height: 0;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }`,

    `.dd-message {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5;
      list-style: none;
      -webkit-font-feature-settings: 'tnum';
      font-feature-settings: 'tnum';
      position: fixed;
      top: 16px;
      left: 0;
      z-index: 1010;
      width: 100%;
      pointer-events: none;
    }`,
  ],
  initCssStyle: function () {
    const styleTag = document.createElement ('style');
    const head = document.getElementsByTagName ('head')[0];
    const cssArray = this.cssArray;
    head.appendChild (styleTag);
    for (var i = 0; i < cssArray.length; i++) {
      styleTag.sheet.insertRule(cssArray[i], i);
    }
  },
  successTag: function (text) {
    return `<div class="dd-message dd-message-notice"><div class="dd-message-notice-content"><div class="dd-message-custom-content dd-message-success"><i aria-label="icon: check-circle" class="ddicon ddicon-check-circle"><svg viewBox="64 64 896 896" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i><span>${text}</span></div></div></div>`;
  },
  errorTag: function (text) {
    return `<div class="dd-message dd-message-notice"><div class="dd-message-notice-content"><div class="dd-message-custom-content dd-message-error"><i aria-label="icon: close-circle" class="ddicon ddicon-close-circle"><svg viewBox="64 64 896 896" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i><span>${text}</span></div></div></div>`;
  },
  show: function (htmlTag) {
    const container = document.createElement('div');
    container.className = 'dd-notification-container';
    container.innerHTML = htmlTag;
    document.body.appendChild(container);
  },
  hide: function () {
    const timer = setTimeout(function () {
      const container = document.querySelector('.dd-notification-container');
      document.body.removeChild(container);
      clearTimeout(timer);
    }, 3000);
  },
  success: function (text) {
    this.show(this.successTag(text));
    this.hide();
  },
  error: function (text) {
    this.show(this.errorTag(text));
    this.hide();
  },
};

export default Notification;