import Config from '../config';

class InitTagAndCss {
  initTipsTag() {
    const body = document.body;
    // 提示
    const tipsElem = document.createElement('div');
    const toolTipTag = `
      <div class="dd-tooltip">
        <div class="dd-tooltip-content">
          <div class="dd-tooltip-arrow dd-tooltip-arrow-plus"></div>
          <div class="dd-tooltip-inner">
            <div class="dd-tooltip-inner-title"></div>
            <div class="dd-tooltip-inner-content"></div>
          </div>
        </div>
      </div>`;
    tipsElem.innerHTML = toolTipTag;
    body.appendChild(tipsElem);
    // 编辑tips的表单
    const popForm = document.createElement('div');
    const popFormTag = `
      <div class="dd-popover" id="dd-edit-form" style="width: 500px; display: none">
        <div class="dd-popover-content">
          <div class="dd-popover-arrow"></div>
          <div class="dd-popover-inner" style="background-color: #fff; width: 400px">
            <div>
              <div class="dd-popover-title">
                <span>提示编辑</span>
                <span data-tip-pop-close="form-close" style="display: inline-block; position: absolute; left: 370px; top: 4px; cursor: pointer">
                  <img src="${Config.closeImage}"/>
                </span>
              </div>
              <div class="dd-popover-inner-content">
                <form class="dd-form" onsubmit="return false">
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    body.appendChild(popForm);
    popForm.innerHTML = popFormTag;
  }

  initCssStyle(systemInfo) {
    let cssArray = [
      `.dd-tooltip {
        position: absolute;
        z-index: 1060;
        visibility: visible;
        font-size: 12px;
        line-height: 1.5;
        opacity: .9;
        display: none;
        max-width: 300px;
      }`,

      `.dd-tooltip-placement-top {
        padding: 5px 0 8px;
      }`,

      `.dd-tooltip-placement-bottom {
        padding: 8px 0 5px;
      }`,

      `.dd-tooltip-placement-left {
        padding: 0 8px 0 5px;
      }`,

      `.dd-tooltip-placement-right {
        padding: 0 5px 0 8px;
      }`,

      `.dd-tooltip-placement-top .dd-tooltip-arrow, .dd-tooltip-placement-bottom .dd-tooltip-arrow {
        left: 50%;
        margin-left: -5px;
      }`,

      `.dd-tooltip-placement-left .dd-tooltip-arrow, .dd-tooltip-placement-right .dd-tooltip-arrow {
        top: 50%;
        margin-top: -5px;
      }`,

      `.dd-tooltip-placement-left .dd-tooltip-arrow {
        right: 3px;
        border-width: 5px 0 5px 5px;
        border-bottom-color: transparent;
        border-right-color: transparent;
        border-top-color: transparent;
      }`,

      `.dd-tooltip-placement-right .dd-tooltip-arrow {
        left: 3px;
        border-width: 5px 5px 5px 0;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-top-color: transparent;
      }`,

      `.dd-tooltip-placement-top .dd-tooltip-arrow {
        bottom: 3px;
        border-width: 5px 5px 0;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
      }`,

      `.dd-tooltip-placement-bottom .dd-tooltip-arrow {
        top: 3px;
        border-width: 0 5px 5px;
        border-left-color: transparent;
        border-right-color: transparent;
        border-top-color: transparent;
      }`,

      `.dd-tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        text-decoration: none;
        border-style: solid;
      }`,

      `.dd-tooltip-arrow-plus {
        border-color: #373737;
        display: block;
      }`,

      `.dd-tooltip-inner {
        padding: 0;
        color: #fff;
        text-align: left;
        text-decoration: none;
        box-shadow: 0 1px 6px hsla(0,0%,39%,.2);
      }`,

      `.dd-tooltip-inner-title {
        background-color: #373737;
        padding: 8px 10px;
        border-radius: 6px;
      }`,

      `.dd-tooltip-inner-content {
        background-color: #373737;
        padding: 8px 10px;
        border-radius: 6px;
      }`,

      `.dd-popover-placement-top, .dd-popover-placement-topLeft, .dd-popover-placement-topRight {
        padding-bottom: 4px;
      }`,

      `.dd-popover-placement-bottom, .dd-popover-placement-bottomLeft, .dd-popover-placement-bottomRight {
        padding-top: 4px;
      }`,

      `.dd-popover {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1030;
        cursor: auto;
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
        white-space: normal;
        font-size: 12px;
        line-height: 1.5;
        font-weight: 400;
        text-align: left;
        max-width: 300px;
      }`,

      `.dd-popover-placement-topLeft .dd-popover-arrow {
        left: 16px;
      }`,

      `.dd-popover-placement-topRight .dd-popover-arrow {
        right: 16px;
      }`,

      `.dd-popover-placement-bottomLeft .dd-popover-arrow {
        left: 16px;
      }`,

      `.dd-popover-placement-bottomRight .dd-popover-arrow {
        right: 16px;
      }`,

      `.dd-popover-placement-top .dd-popover-arrow, .dd-popover-placement-topLeft .dd-popover-arrow, .dd-popover-placement-topRight .dd-popover-arrow {
        border-bottom-width: 0;
        border-top-color: #d5f1fd;
        bottom: 0;
      }`,

      `.dd-popover-placement-bottom .dd-popover-arrow, .dd-popover-placement-bottomLeft .dd-popover-arrow, .dd-popover-placement-bottomRight .dd-popover-arrow {
        border-top-width: 0;
        border-bottom-color: #d5f1fd;
        top: 0;
      }`,

      `.dd-popover-arrow {
        border-width: 5px;
      }`,

      `.dd-popover-placement-top .dd-popover-arrow:after, .dd-popover-placement-topLeft .dd-popover-arrow:after, .dd-popover-placement-topRight .dd-popover-arrow:after {
        content: " ";
        bottom: 1px;
        margin-left: -4px;
        border-bottom-width: 0;
        border-top-color: #d5f1fd;
      }`,

      `.dd-popover-placement-bottom .dd-popover-arrow:after, .dd-popover-placement-bottomLeft .dd-popover-arrow:after, .dd-popover-placement-bottomRight .dd-popover-arrow:after {
        content: " ";
        top: 1px;
        margin-left: -4px;
        border-top-width: 0;
        border-bottom-color: #d5f1fd;
      }`,

      `.dd-popover-arrow:after {
        border-width: 4px;
        content: "";
      }`,

      `.dd-popover-arrow, .dd-popover-arrow:after {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
      }`,

      `.dd-popover-inner {
        min-width: 177px;
        background-color: #eaf8fe;
        background-clip: padding-box;
        border: 1px solid #d5f1fd;
        border-radius: 20px;
        box-shadow: 0 1px 6px #ccc;
      }`,

      `.dd-popover-title {
        margin: 0;
        padding: 0 16px;
        line-height: 32px;
        height: 32px;
        border-bottom: 0;
        color: #787878;
        font-weight: 400;
      }`,

      `.dd-popover-inner-content {
        padding: 8px 16px;
        color: #787878;
      }`,

      `.dd-form {
        font-size: 12px;
        font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
      }`,

      `.dd-input-control{
        margin: 10px auto;
        color: rgba(0,0,0,.85);
        width: 100%;
      }`,

      `.dd-input-control label {
        display: inline-block;
        margin: 5px 0;
      }`,

      `.dd-input-control .dd-input {
        height: 30px;
      }`,

      `.dd-input-control .dd-input::-webkit-input-placeholder {
        color: #ddd;
      }`,

      `.dd-input-control .dd-textarea::-webkit-input-placeholder {
        color: #ddd;
      }`,

      `input[disabled] {
        background: #f5f5f5;
        cursor: not-allowed;
      }`,

      `.dd-input-control .dd-textarea {
        line-height: 20px;
      }`,

      `.dd-input-control .dd-input, .dd-input-control .dd-textarea {
        padding: 5px;
        border: 1px #ccc solid;
        border-radius: 5px;
        background-color: transparent;
        width: 100%;
        color: rgba(0,0,0,.65);
      }`,

      `.dd-select {
        width: 100%;
        height: 30px;
        background-color: #fff;
        border: 1px #ccc solid;
        color: rgba(0,0,0,.65);
      }`,

      `.dd-select option {
        background-color: #fff;
        line-height: 30px;
      }`,

      `.dd-option {
        height: 30px !important;
      }`,

      `.dd-radio-group {
        width: 100%;
        color: rgba(0,0,0,.65);
      }`,

      `.dd-btn, .dd-btn:active, .dd-btn:focus {
        outline: 0;
      }`,

      `.dd-btn {
        line-height: 1.5;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        padding: 0 15px;
        font-size: 14px;
        border-radius: 4px;
        height: 32px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
        transition: all .3s cubic-bezier(.645,.045,.355,1);
        position: relative;
        -webkit-box-shadow: 0 2px 0 rgba(0,0,0,.015);
        box-shadow: 0 2px 0 rgba(0,0,0,.015);
        color: rgba(0,0,0,.65);
        background-color: #fff;
        border-color: #d9d9d9;
      }`,

      `.dd-btn-primary {
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
        text-shadow: 0 -1px 0 rgba(0,0,0,.12);
        -webkit-box-shadow: 0 2px 0 rgba(0,0,0,.035);
        box-shadow: 0 2px 0 rgba(0,0,0,.035);
      }`,

      `.dd-edit-form {
        position: relative;
        left: 50%;
        top: 50%;
        width: 100%;
      }`,

      `.dd-switch {
        width: 45px;
        height: 25px;
        background-color: #ccc;
        border-radius: 25px;
        position: fixed;
        top: 95%;
        right: 0px;
        z-index: 999;
        display: none;
      }`,

      `.dd-switch span {
        width: 20px;
        height: 19px;
        border-radius: 50%;
        margin: 3px;
        background-color: #fff;
        display: inline-block;
        cursor: pointer;
      }`,

      `.dd-switch-checked {
        background-color: #1890ff;
      }`,

      `.dd-switch-checked span {
        margin-left: 23px;
      }`,

      `.dd-input-control input[disabled] {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }`,

      `.dd-input-control textarea[disabled] {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }`,
    ];
    if (systemInfo && systemInfo.containerCss) {
      let containerCssArray = systemInfo.containerCss.split('}');
      containerCssArray.splice(containerCssArray.length - 1, 1); // 删除最后一个空
      containerCssArray = containerCssArray.map(item => {
        return item + '}';
      });
      cssArray = cssArray.concat(containerCssArray);
    }
    const styleTag = document.createElement ('style');
    const head = document.getElementsByTagName ('head')[0];
    head.appendChild (styleTag);
    for (let i = 0; i < cssArray.length; i++) {
      styleTag.sheet.insertRule(cssArray[i], i);
    }
  }
}

export default new InitTagAndCss();
