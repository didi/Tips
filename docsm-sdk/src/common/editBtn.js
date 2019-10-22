import Utils from '../utils';
import Config from '../config';

class EditBtn {
  constructor() {
    this.editBtnCount = {}; // 为每个编辑按钮加计数器，相同Id的按钮只出现第一个
  }

  // 添加编辑按钮
  setEditBtn(elem, tipId) {
    const pathname = Utils.getPathname();
    if (elem && !this.editBtnCount[pathname + tipId]) {
      this.editBtnCount[pathname + tipId] = 1;
      let isSet = false;
      const parent = elem.parentNode;
      const ids = parent.querySelectorAll('[data-tip-edit-id]');
      for (let i = 0; i < ids.length; i++) {
        if (ids[i].getAttribute('data-tip-edit-id') === tipId) {
          isSet = true;
        }
      }
      if (!isSet) {
        const sup = document.createElement('sup');
        sup.setAttribute('data-tip-edit-id', tipId);
        sup.innerHTML = `<img src="${Config.editImage}" style="width: 20px; height: 20px; cursor: pointer"/>`;
        parent.insertBefore(sup, elem.nextSibling);
      }
    }
  }

  // 对有权限用户添加可编辑按钮
  addEditBtn() {
    const all = document.body.querySelectorAll('[data-tip-id]');
    for (let i = 0; i < all.length; i++) {
      const tipId = all[i].getAttribute('data-tip-id');
      this.setEditBtn(all[i], tipId);
    }
  }

  // 隐藏所有编辑按钮
  hideAllEditBtn() {
    const allBtn = document.querySelectorAll('[data-tip-edit-id]');
    for (let i = 0; i < allBtn.length; i++) {
      allBtn[i].parentNode.removeChild(allBtn[i]);
    }
  }
}

export default new EditBtn();
