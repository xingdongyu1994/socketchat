var  express = require('express')
var app = express()
var server = require("http").createServer(app)
var io = require('socket.io')(server)

app.use('/', express.static(__dirname+'/public'))
server.listen(8998,function(){
  console.log("服务器启动")
})
