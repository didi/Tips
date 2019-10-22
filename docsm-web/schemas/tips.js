const Schema = require('mongoose').Schema;

/* contentMap中的数据结构类似下面的
* contentMap = {
*   zh_CN_title: '',
*   zh_CN_content: '编辑',
*   en_US_title: '',
*   en_US_content: 'edit',
* }
*/

const TipsSchema = new Schema({
  systemName: String,
  tipList: [{
    id: String, // 用户手动绑定的id
    tipType: String, // 提示类型
    location: String, // 提示显示位置
    status: Number, // 提示的状态 屏蔽-生效 1-0
    router: String, // 提示所在的页面对应的router
    interval: Number, // 气泡提示的周期
    createDate: String, // 修改时间
    contentMap: Object, // 不同语言的内容
    lastRedactor: String, // 最后修改人
  }],
});

module.exports = TipsSchema;
