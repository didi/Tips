import Ajax from '../utils/ajax';
import Notification from '../utils/notification';
import Config from '../config';
import ContentRequest from '../request';
import Core from '../core';
import Utils from '../utils';

function getTipForm(tipHtml) {
  const tipForm = `
    <div class="dd-input-control">
      <label for="tip">类型：</label>
      <div class="dd-radio-group">
        <input type="radio" name="tip" value="pop" id="radio-pop"/>&nbsp;&nbsp;气泡提示
        <input type="radio" name="tip" value="tip" checked id="radio-tip" style="margin-left: 40px"/>&nbsp;&nbsp;悬浮提示
        <input type="radio" name="tip" value="doc" id="radio-doc" style="margin-left: 40px"/>&nbsp;&nbsp;文档修改
      </div>
    </div>
    <div style="color: orange">如果不需要标题，填写内容即可</div>
    ${tipHtml}
    <div class="dd-input-control">
      <label for="location">提示位置：</label>
      <select name="location" class="dd-select">
        <option value="top">上方</option>
        <option value="bottom">下方</option>
        <option value="left">左方</option>
        <option value="right">右方</option>
      </select>
    </div>
    <div class="dd-input-control" style="text-align: right; margin-top: 10px">
      <button class="dd-btn" style="margin-right: 20px" data-tip-pop-close="form-close">取消</button>
      <button class="dd-btn dd-btn-primary" id="tips-submit">提交</button>
    </div>`;
  return tipForm;
}

function getPopForm(popHtml, data) {
  const popForm = `
    <div class="dd-input-control">
      <label for="tip">类型：</label>
      <div class="dd-radio-group">
        <input type="radio" name="tip" value="pop" checked id="radio-pop"/>&nbsp;&nbsp;气泡提示
        <input type="radio" name="tip" value="tip" id="radio-tip" style="margin-left: 40px"/>&nbsp;&nbsp;悬浮提示
        <input type="radio" name="tip" value="doc" id="radio-doc" style="margin-left: 40px"/>&nbsp;&nbsp;文档修改
      </div>
    </div>
    ${popHtml}
    <div class="dd-input-control">
      <label for="location">提示位置：</label>
      <select name="location" class="dd-select">
        <option value="topRight">左上方</option>
        <option value="bottomRight">左下方</option>
        <option value="topLeft">右上方</option>
        <option value="bottomLeft">右下方</option>
      </select>
    </div>
    <div class="dd-input-control">
      <label for="location">提示周期：</label><br/>
      <input type="number" name="interval" class="dd-input" placeholder="填写弹出周期" value="${data.interval}" style="width: 30%">（天/次）<span style="color: orange">0表示只弹一次</span>
    </div>
    <div class="dd-input-control" style="text-align: right; margin-top: 10px">
      <button class="dd-btn" style="margin-right: 20px" data-tip-pop-close="form-close">取消</button>
      <button class="dd-btn dd-btn-primary" id="tips-submit">提交</button>
    </div>`;
  return popForm;
}

function getDocForm(docHtml, systemInfo) {
  const docForm = `
    <div class="dd-input-control">
      <label for="tip">类型：</label>
      <div class="dd-radio-group">
        <input type="radio" name="tip" value="pop" id="radio-pop"/>&nbsp;&nbsp;气泡提示
        <input type="radio" name="tip" value="tip" id="radio-tip" style="margin-left: 40px"/>&nbsp;&nbsp;悬浮提示
        <input type="radio" name="tip" value="doc" checked id="radio-doc" style="margin-left: 40px"/>&nbsp;&nbsp;文档修改
      </div>
    </div>
    <div style="color: orange">文档修改和<span style="color: red">线上环境域名绑定</span>，修改后在非线上环境可以立即看到效果，确认无误后在【管理系统】点击发布，线上环境即可生效</div>
    ${docHtml}
    <div class="dd-input-control" style="text-align: right; margin-top: 10px">
      <button class="dd-btn" style="margin-right: 20px" data-tip-pop-close="form-close">取消</button>
      <button class="dd-btn dd-btn-primary" id="tips-submit">提交</button>
    </div>`;
  return docForm;
}

class EditForm {
  constructor() {
    this.tipsId = ''; // 当前编辑的tip的id
  }

  // 显示编辑框
  showEditForm(id, offsetTop, offsetLeft, thisWidth, thisHeight) {
    let location;
    if (offsetLeft <= 500) {
      location = 'bottomLeft';
    } else {
      location = 'bottomRight';
    }
    let left = 0, top = 0;
    const elem = document.getElementById('dd-edit-form');
    elem.className =`dd-popover dd-popover-placement-${location}`;
    elem.style.display = 'block';
    // 设置form的位置
    if (location === 'bottomLeft') {
      left = offsetLeft + thisWidth / 2 - 20;
    } else if (location === 'bottomRight') {
      left = offsetLeft - (elem.getBoundingClientRect().width - thisWidth / 2 - 20);
    }
    if (location === 'bottomLeft' || location === 'bottomRight') {
      top = offsetTop + thisHeight + 3;
    }
    elem.style.left = `${left}px`;
    elem.style.top = `${top}px`;
    this.tipsId = id;
    const data = Core.tipsData[id];
    if (data && data.length > 0) {
      this.choiceTipType(data[0].tipType);
    } else {
      this.choiceTipType('tip');
    }
  }

  // 选择渲染哪一个表单
  choiceTipType(type) {
    let data = {};
    if (Core.tipsData[this.tipsId]) {
      const dataArr = Core.tipsData[this.tipsId];
      if (dataArr && dataArr.length > 0) {
        data = dataArr.find(item => item.tipType === type) || {};
      }
    }
    const systemInfo = Core.systemInfo;
    const memberList = Core.systemInfo.memberList;
    let tipHtml = '';
    let docHtml = '';
    const perm = Config.perm;
    if (data.interval === 3650) {
      data.interval = 0;
    }
    memberList.forEach((item) => { // 语言的种类、权限、默认值
      const disabled = (perm === 'all' || perm.indexOf(item.lang) !== -1) ? '' : 'disabled';
      const content = data[`${item.lang}_content`] || '';
      if (type === 'tip' || type === 'pop') {
        const title = data[`${item.lang}_title`] || '';
        tipHtml += `<div class="dd-input-control">
          <label for="title">${Config.languageMap[item.lang]}提示：</label>
          <input type="text" lang=${item.lang} name="title" class="dd-input" placeholder="填写提示标题" ${disabled} value="${title.replace(/"/g, '&quot;')}">
          <textarea lang=${item.lang} name="content" rows="2" class="dd-textarea" placeholder="填写提示内容" style="margin-top: 5px" ${disabled}>${content}</textarea>
        </div>`;
      } else if (type === 'doc') {
        docHtml += `<div class="dd-input-control">
          <label for="content">${Config.languageMap[item.lang]}内容：</label>
          <textarea lang=${item.lang} name="content" rows="2" class="dd-textarea" placeholder="填写文档内容" ${disabled}>${content}</textarea>
        </div>`;
      }
    });
    const tipForm = getTipForm(tipHtml);
    const popForm = getPopForm(tipHtml, data);
    const docForm = getDocForm(docHtml, systemInfo);
    const formContent = document.querySelector('.dd-form');
    if (type === 'tip') {
      formContent.innerHTML = tipForm;
      this.setInitValue('tip', data);
    } else if (type === 'pop') {
      formContent.innerHTML = popForm;
      this.setInitValue('pop', data);
    } else if (type === 'doc') {
      formContent.innerHTML = docForm;
    }
  }
  // 为表单设置默认值
  setInitValue(type, data) {
    if (type === 'tip' || type === 'pop') {
      const select = document.getElementsByName('location')[0];
      switch(data.location) {
      case 'bottom':
      case  'bottomRight':
        select.selectedIndex = 1;
        break;
      case 'left':
      case 'topLeft':
        select.selectedIndex = 2;
        break;
      case 'right':
      case 'bottomLeft':
        select.selectedIndex = 3;
        break;
      default:
        select.selectedIndex = 0;
      }
    }
  }

  // 向后端提交用户填写的数据
  submitTips() {
    const radioTip = document.getElementById('radio-tip');
    const radioPop = document.getElementById('radio-pop');
    const radioDoc = document.getElementById('radio-doc');
    const pathname = Utils.getPathname();
    let url = `${Config.server}/v1/api/tips/add`;
    let tips = {};
    if (radioTip.checked || radioPop.checked) {
      const type = radioTip.checked ? radioTip.value : radioPop.value;
      const titles = document.getElementsByName('title');
      const contents = document.getElementsByName('content');
      const select = document.getElementsByName('location')[0];
      const location = select[select.selectedIndex].value;
      tips = {
        id: this.tipsId,
        tipType: type,
        location: location,
        router: pathname,
        systemName: ContentRequest.serviceName,
        lastRedactor: Config.currentUsername,
      };
      titles.forEach((item, index) => {
        tips[`${item.lang}_title`] = item.value;
        tips[`${item.lang}_content`] = contents[index].value;
      });
      if (radioPop.checked) {
        const intervalInput = document.getElementsByName('interval')[0]; // 气泡弹出周期
        tips.interval = parseInt(intervalInput.value) <= 0 ? 3650 : parseInt(intervalInput.value);
      }
    } else if (radioDoc.checked) {
      const type = radioDoc.value;
      const contents = document.getElementsByName('content');
      tips = {
        id: this.tipsId,
        tipType: type,
        router: pathname,
        systemName: ContentRequest.serviceName,
        lastRedactor: Config.currentUserName,
      };
      contents.forEach(item => {
        tips[`${item.lang}_content`] = item.value;
      });
      url = `${Config.server}/v1/api/document/add`;
    }
    Ajax(url, 'POST', JSON.stringify(tips), this.successCallback);
  }

  // 向服务端发送用户填写的提示信息成功后的回调
  successCallback() {
    Notification.success('保存成功！');
  }
}

export default new EditForm();
