var  express = require('express')
var app = express()
var server = require("http").createServer(app)
var io = require('socket.io')(server)

var users = []  //当前用户

app.use('/', express.static(__dirname+'/public'))
server.listen(8998,function(){
  console.log("服务器启动")
})


//socket
io.on('connection',function(socket){
  // 监听连接用户
  socket.on('login',function(username) {
    console.log("成功建立连接")
    if(users.indexOf(username) > -1) {

    } else {
      socket.username = username
      //给该socket发送数据
      users.push(username)
      socket.emit('logiSuccess')
      //广播 用户 和人数
      io.sockets.emit('userList',users)
      io.sockets.emit('system',username, users.length,'login')
    }
    
  })
  // 监听用户信息
  socket.on('sendMsg',function(msg){
    console.log("发送新消息...")
    //给所有的客户端广播消息
    socket.broadcast.emit('newMsg',socket.username,msg)
  })
  //监听用户离开
  socket.on('disconnect',function(){
    console.log("有用户离开",socket.username)
    if(socket.username !=null) {
      users.splice(users.indexOf(socket.username),1)
      //广播
      socket.broadcast.emit('userList',users)
     socket.broadcast.emit('system',socket.username,users.length,'logout')
    }
  })
})