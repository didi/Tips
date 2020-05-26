import EditForm from '../common/editForm';
import EditBtn from '../common/editBtn';

class EventProxy {
  initEventProxy() {
    const _this = this;
    document.addEventListener('click', function (e) { // 利用事件代理来处理页面的各种点击事件
      let target = {};
      if (event) {
        event.stopPropagation();
        target = event.target;
      } else if (e) {
        e.stopPropagation();
        target = e.target;
      }
      if (target.value === 'tip' || target.value === 'pop' || target.value === 'doc') { // 展示不同类型的表单
        EditForm.choiceTipType(target.value);
      } else if (target.getAttribute('data-tip-pop-close')) { // 关闭pop和form，如果点中的刚好是目标元素
        _this.clickClose(target);
      } else if (target.id === 'tips-submit') { // 如果点击的是提交按钮
        EditForm.submitTips();
      } else if (target.parentNode && target.parentNode !== document) {
        const parent = target.parentNode;
        if (parent.getAttribute('data-tip-pop-close')) {
          _this.clickClose(parent); // 关闭pop和form，如果点中的是图片
        }
        const tipId = parent.getAttribute('data-tip-edit-id'); // 如果点击的是编辑按钮
        if (tipId) {
          const offsetTop = parent.getBoundingClientRect().top + window.pageYOffset; // 获得元素到浏览器顶端的距离，加上页面卷起部分
          const offsetLeft = parent.getBoundingClientRect().left; // 获得元素到浏览器最左端的距离
          const thisWidth = parent.getBoundingClientRect().width; // 获得元素的宽度
          const thisHeight = parent.getBoundingClientRect().height; // 获得元素的高度
          EditForm.showEditForm(tipId, offsetTop, offsetLeft, thisWidth, thisHeight); // 展示form
        }
        if (parent && parent.className === 'dd-switch dd-switch-checked') { // 如果点击的是关闭按钮
          window.sessionStorage.setItem('switch', 'close');
          parent.className = 'dd-switch';
          EditBtn.editBtnCount = {};
          EditBtn.hideAllEditBtn();
        } else if (parent && parent.className === 'dd-switch'){ // 如果点击的是开启按钮
          window.sessionStorage.setItem('switch', 'open');
          parent.className = 'dd-switch dd-switch-checked';
          EditBtn.addEditBtn();
        }
      }
    });
  }

  // 点击关闭pop和form
  clickClose(target) {
    const id = target.getAttribute('data-tip-pop-close'); // 如果点击的是关闭按钮
    if (id) { // 关闭气泡或关闭form
      const closePop = document.getElementById(`dd-tip-pop-${id}`);
      const closeForm = document.getElementById('dd-edit-form');
      if (closePop) {
        closePop.parentNode.removeChild(closePop);
      }
      if (closeForm) {
        closeForm.style.display = 'none';
      }
    }
  }
}

export default new EventProxy();
