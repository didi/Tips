const Schema = require('mongoose').Schema;

const SystemSchema = new Schema({
  name: String, // 系统名
  domain: String, // 线上环境域名
  description: String, // 系统描述
  creator: String, // 创建者
  mumber: String, // 其他成员，可以修改提示
  memberList: [{
    lang: String, // 语言
    username: String, // 语言对应的有权限修改的人，多个逗号隔开
  }],
  containerCss: String, // 自定义样式
  titleSize: String, // 设置标题超过多少长度后显示
  createDate: String, // 创建日期
  lastRedactor: String, // 最后修改人
});

module.exports = SystemSchema;
