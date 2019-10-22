var express = require('express');

// 设置端口
var port = process.env.PORT || 4000;

var app = express();

app.use(express.static('static'));

// 监听端口 
app.listen(port);