const Schema = require('mongoose').Schema;

/* contentMap中的数据结构
* contentMap = {
*   zh_CN_content: '编辑',
*   en_US_content: 'edit',
* }
*/

const DocumentSchema = new Schema({
  systemName: String,
  isPublish: Boolean, // 是否存在未发布内容
  docList: [{
    id: String, // 用户手动绑定的id
    tipType: String, // 提示类型
    router: String, // 提示所在的页面对应的router
    contentMap: Object, // 不同语言的内容
    newContentMap: Object, // 存储未发布的内容
    status: Number, // 提示的状态 屏蔽-生效 1-0
    newStatus: Number, // 未发布的状态
    isPublish: Boolean, // 是否已经发布
    createDate: String, // 修改时间
    lastRedactor: String, // 最后修改人
  }],
});

module.exports = DocumentSchema;
