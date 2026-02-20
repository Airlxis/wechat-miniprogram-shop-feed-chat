// app.js
App({
  globalData:{
    openid:'',
    AccountNumber:'',
    nickName:'',
    avatarUrl:'',
    gender:'',
    GroupUnread:[],
    FriendUnread:[],
    BargainerUnread:[],
    GroupUnreads:0,
    PrivateUnreads:0,
    Unreads:0,


    Day:true,
    SavedShopping:{},
    SavedSquare:{},
    SavedMessages:{},
    SavedMine:{},
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: '****************',
        traceUser: true,
      });
    }
  },


  startwatching:function(){
    const that = this
    const db = wx.cloud.database()
    let initialized = false;
    db.collection('User').where({
    openid:that.globalData.openid})
    .field({Friends:true,ChatGroup:true,Bargainer:true})
  .watch({
    onChange: function(snapshot) {

      if (!initialized) {
        initialized = true;

        return; // 在初始化时直接返回，不执行后续代码
      }
      let record = snapshot.docs[0]

      //三个消息列表的分别的未读消息数量
      let GroupUnread = record.ChatGroup.map(item => item.UnRead)
      let FriendUnread = record.Friends.map(item => item.Unread)
      let BargainerUnread = record.Bargainer.map(item => item.Unread)

      //三个消息列表分别的统计未读数量
      let GroupUnreads = GroupUnread.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
       }, 0);
       let FriendUnreads = FriendUnread.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
       }, 0);
       let BargainerUnreads = BargainerUnread.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
       }, 0);
       let PrivateUnreads = FriendUnreads + BargainerUnreads
       let Unreads = PrivateUnreads + GroupUnreads

       that.globalData.GroupUnread = GroupUnread
       that.globalData.FriendUnread = FriendUnread
       that.globalData.BargainerUnread = BargainerUnread
       that.globalData.GroupUnreads = GroupUnreads
       that.globalData.PrivateUnreads = PrivateUnreads
       that.globalData.Unreads = Unreads

       that.eventEmitter.emit('UnreadUpdated')
    },
    onError: function(err) {
      console.error('监听出错', err);
    }
  });
  },

  eventEmitter: {
    listeners: {},
    on: function(eventName, callback) {
      // 注册事件监听器
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(callback);
    },
    emit: function(eventName, data) {
      // 触发事件
      const callbacks = this.listeners[eventName];
      if (callbacks) {
        callbacks.forEach(callback => callback(data));
      }
    }
  }
});
