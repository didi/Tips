const moment = require('moment');
const TipsModel = require('../models/tips');
const SystemModel = require('../models/system');
const format = require('../utils/format');

// 添加单个
exports.addTip = function (req, res) {
  const data = req.body;
  SystemModel.findOne({name: data.systemName}, (e, systemInfo) => {
    if (e) {
      res.status(500).end({
        code: 500,
        msg: '数据库异常',
      });
    } else if (systemInfo && systemInfo.name) {
      const tip = {
        id: data.id,
        tipType: data.tipType,
        location: data.location,
        router: data.router,
        createDate: (new Date()).toString(),
        status: 0, // 默认显示
        interval: data.interval,
        lastRedactor: data.lastRedactor,
        contentMap: {}
      };
      Object.keys(data).forEach(item => {
        if (item.indexOf('title') > -1 || item.indexOf('content') > -1) {
          tip.contentMap[item] = data[item];
        }
      });
      let flag = 'add';
      TipsModel.findOne({systemName: data.systemName}, (err, tipItem) => {
        if (err) {
          res.status(500).end({
            code: 500,
            msg: '数据库异常',
          });
        } else if (tipItem && tipItem.systemName) { // 如果系统中已经存在数据
          let tipList = [];
          if (tipItem.tipList) {
            tipList = tipItem.tipList;
          }
          for (let i = 0; i < tipList.length; i++) {
            if (tip.router === tipList[i].router && tipList[i].id === tip.id && tipList[i].tipType === tip.tipType) { // 在id已存在的基础上更新
              tipList[i] = tip;
              flag = 'update';
            }
          }
          if (flag === 'add') { // Id不存在时直接添加
            tipList.push(tip);
          }
          TipsModel.updateMany({systemName: data.systemName}, {tipList: tipList}, (error) => {
            if (error){
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
          list.push(tip);
          const tipsInfo = {
            systemName: data.systemName,
            tipList: list,
          };
          const tipsModel = new TipsModel(tipsInfo);
          tipsModel.save((error) => {
            if (error) {
              res.status(500).end({
                code: 500,
                msg: '数据库异常',
              });
            } else {
              res.send({
                code: 200,
                msg: '保存成功！',
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
exports.addTips = function (req, res) {
  const tipsInfo = req.body;
  SystemModel.findOne({name: tipsInfo.systemName}, (e, systemInfo) => {
    if (e) {
      res.status(500).end({
        code: 500,
        msg: '数据库异常',
      });
    } else if (systemInfo && systemInfo.name) {
      const list = format.formatTipList(tipsInfo);
      TipsModel.findOne({systemName: tipsInfo.systemName}, (err, tip) => {
        if (err) {
          res.status(500).end({
            code: 500,
            msg: '数据库异常',
          });
        } else if (tip && tip.systemName) {
          let tipList;
          if (tip.tipList && tip.tipList.length > 0) {
            tipList = tip.tipList.concat(list);
          } else {
            tipList = list;
          }
          TipsModel.updateMany({systemName: tipsInfo.systemName}, {tipList: tipList}, (error) => {
            if (error) {
              res.status(500).end({
                code: 500,
                msg: '数据库异常',
              });
            } else {
              res.send({
                code: 200,
                msg: '保存成功',
              });
            }
          });
        } else {
          const tips = {
            systemName: tipsInfo.systemName,
            tipList: list,
          };
          var tipsModel = new TipsModel(tips);
          tipsModel.save((error) => {
            if (error) {
              res.status(500).end({
                code: 500,
                msg: '数据库异常',
              });
            } else{
              res.send({
                code: 200,
                msg: '保存成功',
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
exports.getTipList = function (req, res) {
  const systemName = req.query.systemName;
  if (systemName) {
    TipsModel.findOne({systemName: systemName}, (err, tip) => {
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else if (tip && tip.tipList && tip.tipList.length > 0){
        const tipList = tip.tipList.map(item => {
          const it = {
            id: item.id,
            tipType: item.tipType,
            location: item.location,
            router: item.router,
            createDate: item.createDate,
            status: item.status,
            interval: item.interval,
            lastRedactor: item.lastRedactor,
            ...item.contentMap,
          };
          return it;
        });
        res.send({
          code: 200,
          data: tipList,
        });
      } else {
        res.send({
          code: 200,
          msg: '暂无提示信息',
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

// 更新tip的状态 屏蔽-生效
exports.updateTipStatus = function (req, res) {
  const data = req.body;
  const systemName = data.systemName;
  const id = data.id;
  const tipType = data.tipType;
  const router = data.router;
  if (systemName && id) {
    TipsModel.findOne({systemName: systemName}, (err, tip) => {
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else if (tip) {
        const tipList = tip.tipList;
        for (let i = 0; i < tipList.length; i++) {
          if (tipList[i].id === id && tipList[i].tipType === tipType && tipList[i].router === router) {
            if (tipList[i].status === 1) {
              tipList[i].status = 0;
            } else {
              tipList[i].status = 1;
            }
            tipList[i].lastRedactor = data.lastRedactor;
            tipList[i].createDate = (new Date()).toString();
            break;
          }
        }
        TipsModel.updateMany({systemName: systemName}, {tipList: tipList}, (error) => {
          if (error) {
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
      } else {
        res.status(400).end({
          code: 400,
          msg: '系统不存在',
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

// 获得所有未屏蔽的tips，在SDK使用
exports.getTipListByUnmask = function (req, res) {
  const systemName = req.query.systemName;
  const currentUser = req.query.currentUsername;
  if (systemName) {
    TipsModel.findOne({systemName: systemName}, (err, tip) => {
      const list = [];
      let perm = false;
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else if (tip && tip.tipList && tip.tipList.length > 0) {
        tip.tipList.forEach(function (item) {
          if (item.status === 0) {
            if (item.createDate && item.tipType === 'pop' && item.interval) { // 带有周期的pop提示
              const subDays = moment().diff(moment(new Date(item.createDate).valueOf()), 'days');
              if (subDays === 0 || subDays / item.interval === parseInt(subDays / item.interval)) {
                item.isPop = true;
              }
            }
            list.push({
              id: item.id,
              tipType: item.tipType,
              location: item.location,
              router: item.router,
              createDate: item.createDate,
              status: item.status,
              isPop: item.isPop,
              interval: item.interval,
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
          if (currentUser && systemInfo.creator.indexOf(currentUser) > -1) {
            perm = 'all';
          } else if (systemInfo.memberList && systemInfo.memberList.length > 0) {
            const permList = [];
            systemInfo.memberList.forEach(item => {
              if (currentUser && item.username && item.username.indexOf(currentUser) > -1) {
                permList.push(item.lang);
              }
            });
            perm = permList.join(',');
          }
          res.send({
            code: 200,
            data: {
              tipList: list,
              perm: perm,
              systemInfo,
            },
          });
        } else {
          res.send({
            code: 200,
            data: {
              tipList: [],
              systemInfo: {},
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



