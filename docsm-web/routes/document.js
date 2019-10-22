const DocumentModel = require('../models/document');
const SystemModel = require('../models/system');
const format = require('../utils/format');

// 添加单个
exports.addDocument = function (req, res) {
  const data = req.body;
  SystemModel.findOne({name: data.systemName}, (e, systemInfo) => {
    if (e) {
      res.status(500).end({
        code: 500,
        msg: '数据库异常',
      });
    } else if (systemInfo && systemInfo.name) {
      const doc = {
        id: data.id,
        tipType: data.tipType,
        router: data.router,
        isPublish: false, // 默认未发布
        createDate: (new Date()).toString(),
        lastRedactor: data.lastRedactor,
        contentMap: {}, // 线上环境使用
        status: 0, // 默认显示
        newContentMap: {}, // 未发布
        newStatus: 0, // 未发布
      };
      Object.keys(data).forEach(item => {
        if (item.indexOf('content') > -1) {
          doc.newContentMap[item] = data[item];
        }
      });
      let flag = 'add';
      DocumentModel.findOne({systemName: data.systemName}, (err, docItem) => {
        if (err) {
          res.status(500).end({
            code: 500,
            msg: '数据库异常',
          });
        } else if (docItem && docItem.systemName) { // 如果系统中已经存在数据
          let docList = [];
          if (docItem.docList) {
            docList = docItem.docList;
          }
          for (var i = 0; i < docList.length; i++) {
            if (doc.router === docList[i].router && docList[i].id === doc.id && docList[i].tipType === doc.tipType) { // 在id已存在的基础上更新
              const contentMap = docList[i].contentMap;
              docList[i] = doc;
              docList[i].contentMap = contentMap;
              flag = 'update';
            }
          }
          if (flag === 'add') { // Id不存在时直接添加
            docList.push(doc);
          }
          DocumentModel.updateMany({systemName: data.systemName}, {docList: docList, isPublish: false}, (error) => {
            if (error) {
              res.status(500).end({
                code: 500,
                msg: '数据库异常',
              });
            } else {
              const message = flag === 'add' ? '新增成功' : '修改成功';
              res.send({
                code: 200,
                msg: message,
              });
            }
          });
        } else { // 系统名存在，但是还没有数据
          const list = [];
          list.push(doc);
          const docInfo = {
            systemName: data.systemName,
            docList: list,
            isPublish: false,
          };
          const docModel = new DocumentModel(docInfo);
          docModel.save(function (err){
            if (err) {
              res.status(500).end({
                code: 500,
                msg: '数据库异常',
              });
            } else {
              res.send({
                code: 200,
                msg: '新增成功',
              });
            }
          });
        }
      });
    } else {
      res.status(400).end({
        code: 400,
        msg: '系统名不存在',
      });
    }
  });
};

// 批量添加和修改
exports.addDocumentList = function (req, res) {
  const docInfo = req.body;
  SystemModel.findOne({name: docInfo.systemName}, (e, systemInfo) => {
    if (e) {
      res.status(500).end({
        code: 500,
        msg: '数据库异常',
      });
    } else if (systemInfo && systemInfo.name) {
      const list = format.formatDocList(docInfo);
      DocumentModel.findOne({systemName: docInfo.systemName}, (err, doc) => {
        if (err) {
          res.status(500).end({
            code: 500,
            msg: '数据库异常',
          });
        } else if (doc.systemName) {
          let docList;
          if (doc.docList && doc.docList.length > 0) {
            docList = doc.docList.concat(list);
          } else {
            docList = list;
          }
          DocumentModel.updateMany({systemName: docInfo.systemName}, {docList: docList, isPublish: false}, (error) => {
            if (error) {
              res.status(500).end({
                code: 500,
                msg: '数据库异常',
              });
            } else {
              res.send({
                code: 200,
                msg: '新增成功',
              });
            }
          });
        } else {
          const docs = {
            systemName: docInfo.systemName,
            docList: list,
            isPublish: false,
          };
          var docModel = new DocumentModel(docs);
          docModel.save(function (err) {
            if (err) {
              res.status(500).end({
                code: 500,
                msg: '数据库异常',
              });
            } else {
              res.send({
                code: 200,
              });
            }
          });
        }
      });
    } else {
      res.status(400).end({
        code: 400,
        msg: '系统名不存在',
      });
    }
  });
};

// 获得所所有的提示在管理前端展示
exports.getDocumentList = function (req, res) {
  const systemName = req.query.systemName;
  if (systemName) {
    DocumentModel.findOne({systemName: systemName}, (err, doc) => {
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else if (doc && doc.docList && doc.docList.length > 0){
        const docList = doc.docList.map(item => {
          return {
            id: item.id,
            tipType: item.tipType,
            router: item.router,
            status: item.newStatus, // 默认显示
            isPublish: item.isPublish, // 默认未发布
            createDate: item.createDate,
            lastRedactor: item.lastRedactor,
            ...item.newContentMap,
          };
        });
        res.send({
          code: 200,
          data: {
            documentList: docList,
            isPublish: doc.isPublish,
          }
        });
      } else {
        res.send({
          code: 200,
          msg: '暂无文案数据',
        });
      }
    });
  } else {
    res.status(400).end({
      code: 400,
      msg: '系统名不能为空',
    });
  }
};

// 更新document的状态 屏蔽-生效
exports.updateDocumentStatus = function (req, res) {
  const data = req.body;
  const systemName = data.systemName;
  const id = data.id;
  const tipType = data.tipType;
  const router = data.router;
  if (systemName && id) {
    DocumentModel.findOne({systemName: systemName}, (err, doc) => {
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else if (doc) {
        const docList = doc.docList;
        for (let i = 0; i < docList.length; i++) {
          if (docList[i].id === id && docList[i].tipType === tipType && docList[i].router === router) {
            if (docList[i].status === 1) {
              docList[i].newStatus = 0;
            } else {
              docList[i].newStatus = 1;
            }
            docList[i].isPublish = false;
            docList[i].lastRedactor = data.lastRedactor;
            docList[i].createDate = (new Date()).toString();
            break;
          }
        }
        DocumentModel.updateMany({systemName: systemName}, {docList: docList, isPublish: false}, (error) => {
          if (error){
            res.status(500).end({
              code: 500,
              msg: '数据库异常',
            });
          } else {
            res.send({
              code: 200,
              msg: '修改成功',
            });
          }
        });
      }
    });
  } else {
    res.status(400).end({
      code: 400,
      msg: '参数不能为空',
    });
  }
};

// 获得所有未屏蔽和已发布的docs，在线上环境SDK使用
exports.getDocumentListByUnmask = function (req, res) {
  var systemName = req.query.systemName;
  if (systemName) {
    DocumentModel.findOne({systemName: systemName}, (err, doc) => {
      const list = [];
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else if (doc && doc.docList && doc.docList.length > 0) {
        doc.docList.forEach((item) => {
          if (item.status === 0) {
            list.push({
              id: item.id,
              tipType: item.tipType,
              router: item.router,
              ...item.contentMap,
            });
          }
        });
      }
      SystemModel.findOne({name: systemName}, (error, systemInfo) => {
        if (error) {
          res.status(500).end({
            code: 500,
            msg: '数据库异常',
          });
        } else if (systemInfo) {
          res.send({
            code: 200,
            data: {
              documentList: list,
              systemInfo,
            },
          });
        } else {
          res.send({
            code: 200,
            data: {
              documentList: [],
              systemInfo: {}
            },
          });
        }
      });
    });
  } else {
    res.status(400).end({
      code: 400,
      msg: '无系统名',
    });
  }
};

// 发布接口
exports.publishDocumentList = function(req, res) {
  const { systemName, lastRedactor } = req.body;
  if (systemName) {
    DocumentModel.findOne({systemName: systemName}, (err, doc) => {
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else if (doc && doc.docList) {
        const docList = doc.docList;
        docList.forEach(item => {
          if (!item.isPublish) {
            item.isPublish = true;
            item.contentMap = item.newContentMap;
            item.status = item.newStatus;
            item.lastRedactor = lastRedactor;
          }
        });
        DocumentModel.updateMany({systemName: systemName}, {docList: docList, isPublish: true}, (error) => {
          if (error) {
            res.status(500).end({
              code: 500,
              msg: '数据库异常',
            });
          } else {
            res.send({
              code: 200,
              msg: '发布成功',
            });
          }
        });
      } else {
        res.send({
          code: 200,
          msg: '暂无数据',
        });
      }
    });
  } else {
    res.status(400).end({
      code: 400,
      msg: '参数错误，无系统名',
    });
  }
};



