window.onload = function() {
  var mychat = new MyChat()
  mychat.init()
}
//定义一个类用于开发程序
var MyChat = function() {
  this.socket = null
}
var chattxt = document.getElementById('chat-bottom-input')
var userlist=document.getElementById('userList')
/**
 * 添加方法
 */
MyChat.prototype = {
  init: ()=>{
    var that = this
    console.log("kjhgfdfghjkjhgfd",this)
    //连接
    this.socket = io.connect()
    //客户端监听连接  成功后
    this.socket.on('connect',function(){
      document.getElementById('cover-status').textContent = '请输入昵称'
      document.getElementById('cover-main').style.display = 'flex'
      document.getElementById('cover-login-input').focus()
    })
    //登录
    document.getElementById('login-btn').addEventListener('click',function(){
      var username = document.getElementById('cover-login-input').value
      //客户端发送数据
      that.socket.emit('login',username)
    },false)
    //登录成功
    this.socket.on('logiSuccess',function(){
      document.getElementById('cover-main').style.display = 'none'
      document.getElementById('chat-bottom-input').focus()
    })
    //用户列表更新
    this.socket.on('userList',function(users) {
      console.log("脚后跟发的撒",users)
      userlist.textContent=''
      users.forEach(function(item){
        var newuser = document.createElement('li')
        newuser.textContent = '用户:'+item
        userlist.appendChild(newuser)
      })
    })
    // 系统消息 包括用户在线人数
    this.socket.on('system',function(username,usernum,currtype){
     var msg = username+(currtype === 'login'?'加入':'离开')
     MyChat.prototype.shownewmsg('系统消息',msg)
     document.getElementById('chat-top-status').textContent= usernum+ ' 位用户在线'
    })
    //发送数据
    document.getElementById('send-btn').addEventListener('click',function(){
      var msg = chattxt.value
      
      //客户端发送数据
      that.socket.emit('sendMsg',msg)
      MyChat.prototype.shownewmsg('我',msg)
    },false)
    //消息
    this.socket.on('newMsg',function(user,msg){
      console.log("客户端ddd")
      MyChat.prototype.shownewmsg(user,msg)
    })
  },
  shownewmsg: (user, msg)=> {
    console.log("gggggggggg")
    var systemMsg = document.getElementById('chat-top-infoarea')
    var newMsg  = document.createElement('p')
    newMsg.innerHTML = user + ' (' + new Date().toTimeString().substr(0, 8) + ') : '+ msg
    systemMsg.appendChild(newMsg)
    systemMsg.scrollTop = systemMsg.scrollHeight
  },
}