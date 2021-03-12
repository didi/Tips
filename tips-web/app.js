const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const route = require('./routes');
const config = require('./config');

const app = express();
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: false,
}));

const runConfig = {};
if (process.env.RUN_ENV === 'dev') {
  runConfig.port = config.devPort;
  runConfig.mongodbUrl = config.devMongodbUrl;
} else {
  runConfig.port = config.port;
  runConfig.mongodbUrl = config.mongodbUrl;
}

app.listen(runConfig.port);

console.log(`Server is runnng on ${runConfig.port} successfully!`);

mongoose.Promise = global.Promise;
mongoose.connect(runConfig.mongodbUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongoose connection to Mongodb successfully!');
  }).catch((err) => {
    console.log(`Mongoose connection error: ${err}`);
  });

route(app);


