const SystemModel = require('../models/system');

// 添加系统信息
exports.addSystem = function (req, res) {
  const systemInfo = req.body;
  systemInfo.createDate = (new Date()).toString();
  SystemModel.findOne({name: systemInfo.name}, function (err, doc) {
    if (err) {
      res.status(500).end({
        code: 500,
        msg: '数据库异常',
      });
    } else if (doc && doc.name) {
      SystemModel.updateOne({name: systemInfo.name}, systemInfo, function (err, result) {
        if (err) {
          res.status(500).end({
            code: 500,
            msg: '数据库异常',
          });
        } else if (result && result.ok) {
          res.send({
            code: 200,
            msg: '修改成功'
          });
        }
      });
    } else {
      const systemModel = new SystemModel(systemInfo);
      systemModel.save(function (err){
        if (err) {
          res.status(500).end({
            code: 500,
            msg: '数据库异常',
          });
        } else {
          res.send({
            code: 200,
            msg: '新增成功'
          });
        }
      });
    }
  });
};

// 获得所有的系统列表
exports.getSystemList = function (req, res) {
  SystemModel.find({}, function (err, systemList) {
    if (err) {
      res.status(500).end({
        code: 500,
        msg: '数据库异常',
      });
    } else {
      res.send({
        code: 200,
        data: systemList,
      });
    }
  });
};

// 获得单个某个系统
exports.getSystem = function (req, res) {
  const systemName = req.query.systemName;
  if (systemName) {
    SystemModel.findOne({name: systemName}, function (err, system) {
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else {
        res.send({
          code: 200,
          data: system,
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

exports.getUserPerm = function (req, res) {
  const systemName = req.query.systemName;
  const currentUser = req.query.currentUsername;
  if (systemName) {
    SystemModel.findOne({name: systemName}, function (err, systemInfo) {
      if (err) {
        res.status(500).end({
          code: 500,
          msg: '数据库异常',
        });
      } else {
        if (systemInfo && systemInfo.name) {
          let perm = '';
          if (currentUser && systemInfo.creator.indexOf(currentUser) > -1) {
            perm = 'all';
          } else if (systemInfo.memberList && systemInfo.memberList.length > 0){
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
            data: perm,
            msg: 'success',
          });
        } else {
          res.send({
            code: 200,
            data: '',
            msg: 'success',
          });
        }
      }
    });
  }
};
