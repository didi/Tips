import EditBtn from './editBtn';
import Utils from '../utils';
import Config from '../config';

class Switch {
  setSwitch() {
    const perm = Config.perm;
    const body = document.body;
    // 设置开关
    const switchBtnContainer = document.createElement('div');
    var switchBtnTag = `
      <div class="dd-switch">
        <span></span>
      </div>`;
    switchBtnContainer.innerHTML = switchBtnTag;
    body.appendChild(switchBtnContainer);
    let position = window.localStorage.getItem('TipsSwitchPosition');
    if (position) {
      position = JSON.parse(position);
      const btn = document.querySelector('.dd-switch');
      if (btn) {
        btn.style.left = position.left + '%';
        btn.style.top = position.top + '%';
      }
    }
    const switchBtn = document.querySelector('.dd-switch');
    this.switchDrag(switchBtn);
    const switchStatus = window.sessionStorage.getItem('switch');
    if (perm || switchStatus === 'open') {
      if (switchStatus === 'open') {
        EditBtn.addEditBtn();
        switchBtn.className = 'dd-switch dd-switch-checked';
      } else {
        switchBtn.className = 'dd-switch';
      }
      switchBtn.style.display = 'inline-block';
    } else {
      switchBtn.style.display = 'none';
    }
  }

  // 拖拽函数
  switchDrag(switchBtn) {
    if (switchBtn) {
      switchBtn.addEventListener('mousedown', function (e) {
        let dragging = true;
        const switchBtnX = switchBtn.offsetLeft;
        const switchBtnY = switchBtn.offsetTop;
        const mouseX = parseInt(e.clientX);
        const mouseY = parseInt(e.clientY);
        const offsetX = mouseX - switchBtnX;
        const offsetY = mouseY - switchBtnY;
        let x, y;
        switchBtn.parentNode.style.cssText = 'position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 1000';
        document.addEventListener('mousemove', Utils.debounce(function (ev) {
          if (dragging) {
            x = ev.clientX - offsetX;
            y = ev.clientY - offsetY;
            const width = document.documentElement.clientWidth - switchBtn.offsetWidth;
            const height = document.documentElement.clientHeight - switchBtn.offsetHeight;
            x = Math.min(Math.max(0, x), width) / document.documentElement.clientWidth * 100;
            y = Math.min(Math.max(0, y), height) / document.documentElement.clientHeight * 100;
            switchBtn.style.left = x + '%';
            switchBtn.style.top = y + '%';
          }
        }, 10), false);
        document.addEventListener('mouseup', function () {
          dragging = false;
          switchBtn.parentNode.style.cssText = '';
          window.localStorage.setItem('TipsSwitchPosition', JSON.stringify({left: x, top: y})); // 存储开关位置
        }, false);
      }, false);
    }
  }
}

export default new Switch();

