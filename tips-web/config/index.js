// 关于sso的相关配置

const config = {
  devMongodbUrl: 'mongodb://127.0.0.1/tips', // 线下数据库
  mongodbUrl: 'mongodb://127.0.0.1/tips', // 线上数据库
  devPort: 8081, // 线下端口
  port: 8081, // 线上端口
};

module.exports = config;
