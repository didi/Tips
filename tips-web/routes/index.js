const system = require('./system');
const tips = require('./tips');
const document = require('./document');

// 接口中以/v1/api开头的都是要在sdk中使用的
module.exports = function (app) {
  // 编辑权限
  app.get('/v1/api/perm', system.getUserPerm); // 获得编辑权限

  // 关于系统的操作
  app.post('/v1/system/add', system.addSystem); // 添加系统信息

  app.get('/v1/system/list', system.getSystemList); // 获得所有系统信息

  app.get('/v1/system/get', system.getSystem); // 获得单个系统信息

  // 关于提示的操作
  app.post('/v1/tips/list/add', tips.addTips); // 批量添加

  app.post('/v1/api/tips/add', tips.addTip); // 添加单个

  app.get('/v1/tips/list', tips.getTipList); // 获得所有的提示信息

  app.post('/v1/tips/status/update', tips.updateTipStatus); // 更新 屏蔽-未屏蔽

  app.get('/v1/api/tips', tips.getTipListByUnmask); // 根据状态获得 屏蔽-未屏蔽

  // 关于文档的操作
  app.post('/v1/document/list/add', document.addDocumentList); // 批量添加

  app.post('/v1/api/document/add', document.addDocument); // 添加单个

  app.get('/v1/api/document/list', document.getDocumentList); // 获得所有的文案信息

  app.post('/v1/document/status/update', document.updateDocumentStatus); // 更新 屏蔽-未屏蔽

  app.get('/v1/api/documents', document.getDocumentListByUnmask); // 根据状态获得 屏蔽-未屏蔽

  app.post('/v1/document/publish', document.publishDocumentList); // 发布

};
