// pages/GroupChatting/GroupChatting.js
Page({

  data: {
    GroupID:'',
    GroupName:'',
    MyOpenid:'',
    Messages:[],
    MessageToSend:'',
    inputValue:'',
    ImagePath:'',
    ImageFileID:'',
  },

  onLoad(options) {
    const app = getApp()
    const that = this
    that.setData({
      GroupID:parseInt(options.GroupID),
      MyOpenid:app.globalData.openid
    })
    
    wx.showLoading({
      title: '加载聊天记录',
    })
    wx.cloud.callFunction({
      name:'GroupChatHistory',
      data:{
        CurrentMessagesNumber:that.data.Messages.length,
        GroupID:that.data.GroupID,
        MyOpenid:that.data.MyOpenid
      },
      success:function(res){
        console.log(res.result)
        that.setData({
          Messages:that.data.Messages.concat(res.result.MessagesToAdd),
          GroupName:res.result.GroupName
         }, () => {
          // 数据更新后，执行滚动指令
          that.scrollToBottom();
        })
        wx.hideLoading()
      },
      fail:function(err){
        console.error('调用获取群聊聊天记录的云函数失败',err)
      }
    })
    that.startwatching()
  },
 
  onShow(){
    const that = this
    wx.cloud.callFunction({
      name:'ClearUnreadGro',
      data:{
        MyOpenid:that.data.MyOpenid,
        GroupID:that.data.GroupID
      },
      success(res){
      },
      fail(err){
        console.error(err)
      }
    })
  },

  onUnload() {
    const that = this
    wx.cloud.callFunction({
      name:'ClearUnreadGro',
      data:{
        MyOpenid:that.data.MyOpenid,
        GroupID:that.data.GroupID
      },
      success(res){
      },
      fail(err){
        console.error(err)
      }
    })
    console.log('hide')
    // 页面隐藏时停止监听
    if (that.watcher) {
      that.watcher.close();
    }
  },

  scrollToBottom:function(){
    const that = this
    wx.createSelectorQuery().select('.scroll-view').boundingClientRect(function(rect) {
      // 这里假设 ScrollView 的标识类为 'scroll-view'
      // rect 是 ScrollView 的布局位置信息
      that.setData({
        scrollTop: rect.height // 这里设置为 ScrollView 的高度
      });
      console.log( rect)
    }).exec();
  },

  startwatching:function(){
    const that = this;
    const db = wx.cloud.database()

    var GroupID = parseInt(that.data.GroupID)
    let initialized = false;
 db.collection('GroupChat').where({
    _id:GroupID
  }).watch({
    onChange: function(snapshot) {
      if (!initialized) {
        initialized = true;
        return; // 在初始化时直接返回，不执行后续代码
      }  
      console.log('shot',snapshot)
        let message = snapshot.docs[0].Messages
        let newmessage = message[message.length - 1]
        console.log('新消息',newmessage)
        that.giveprofiletonewmessage(newmessage)        
    },
    onError: function(err) {
      console.error('监听出错', err);
    }
  });
  },

  previewImage(e){
    console.log(e)
    wx.previewImage({
      urls: [e.currentTarget.dataset.image], // 数组中放入需要预览的图片链接
      current: e.currentTarget.dataset.image // 当前显示图片的链接
    });
  },

  giveprofiletonewmessage:function(newmessage){
    const that = this
    wx.cloud.callFunction({
      name:'giveprofiletonewmessage',
      data:{
        newmessage:newmessage
      },
      success:function(res){
        that.setData({ Messages:[res.result].concat(that.data.Messages)})
      }
    })
  },

  input: function(e) {
    this.setData({ MessageToSend: e.detail.value });
    },
     
  CalculateBubble: function() {
      const windowInfo = wx.getWindowInfo(); // 这是一个同步方法
      const screenWidth = windowInfo.screenWidth;
      
      return new Promise((resolve, reject) => {
        const query = wx.createSelectorQuery();
        query.select('.input').boundingClientRect();
        query.exec((res) => {
          if (res[0]) {
            const textareaWidth = res[0].width;
            const bubbleWidth = Math.round((750 / screenWidth) * textareaWidth) + 25;
            console.log('buublewidth', bubbleWidth);
            resolve(bubbleWidth); // 解决 Promise 并传递 bubbleWidth
          } else {
            reject(new Error('无法获取输入框的宽度'));
          }
        });
      });
     },

  SendText:function(e){
    const that = this

    that.CalculateBubble().then((bubbleWidth) => {
      wx.showLoading({
        title: '发送消息',
      })
      wx.cloud.callFunction({
        name:'SendMessageInGroupChat',
        data:{
          GroupID:that.data.GroupID,
          MyOpenid:that.data.MyOpenid,
          Time:new Date().getTime(),
          Type:'text',
          Content:that.data.MessageToSend,
          BubbleWidth:bubbleWidth
        },
        success:function(res){
          console.log(res)
          that.setData({inputValue:'',MessageToSend:''})
          wx.hideLoading()
          that.scrollToBottom()
        },
        fail:function(err){
          console.error('调用发送信息的云函数失败',err)
        }
      })
    }).catch((error) => {
      console.error('CalculateBubble 方法出错:', error);
    });
  },

  scrollToBottom:function(){
    const that = this
    wx.createSelectorQuery().select('.scroll-view').boundingClientRect(function(rect) {
      // 这里假设 ScrollView 的标识类为 'scroll-view'
      // rect 是 ScrollView 的布局位置信息
      that.setData({
        scrollTop: rect.height // 这里设置为 ScrollView 的高度
      });
    }).exec();
  },

  AskForMoreHistory:function(e){
    const that = this
    wx.cloud.callFunction({
      name:'GroupChatHistory',
      data:{
        CurrentMessagesNumber:that.data.Messages.length,
        GroupID:that.data.GroupID,
        MyOpenid:that.data.MyOpenid
      },
      success:function(res){
        console.log(res)
        that.setData({Messages:that.data.Messages.concat(res.result.MessagesToAdd) })
      
      },
      fail:function(err){
        console.error('调用获取私聊聊天记录的云函数失败',err)
      }
    })
  },

  chooseMedia: function () {
    const that = this;
    wx.chooseMedia({
      count: 1, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        that.setData({
          ImagePath: res.	tempFiles[0].tempFilePath}, () => {
            // 数据更新后，执行滚动指令
            that.UploadImage();
        })
      }
    })
  },

  UploadImage:function(){
    let that = this;
    const cloudPath = 'GroupChatImage/' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000) + that.data.MyOpenid + that.data.GroupID;
    wx.cloud.uploadFile({
      cloudPath:cloudPath, 
      filePath:that.data.ImagePath, 
      success(res) {
        that.setData({ImageFileID:res.fileID})
        console.log('上传封面成功', res.fileID);
        that.SendImage();
      },
      fail(err) {
        console.error('上传封面失败', err);
      }
    })
  },

  SendImage:function(){
    const that = this
    wx.showLoading({
      title: '发送消息',
    })
    wx.cloud.callFunction({
      name:'SendMessageInGroupChat',
      data:{
        GroupID:that.data.GroupID,
        MyOpenid:that.data.MyOpenid,
        Time:new Date().getTime(),
        Type:'image',
        Content:that.data.ImageFileID
      },
      success:function(res){
        console.log(res)
        wx.hideLoading()
        that.scrollToBottom()
      },
      fail:function(err){
        console.error('调用发送信息的云函数失败',err)
      }
    })
  },

  ToOther:function(e){
    const app = getApp()
    console.log(e.currentTarget.dataset.openid)
    if(e.currentTarget.dataset.openid === app.globalData.openid){
      console.log('这是自己的')
      return
    }else{
      wx.navigateTo({
        url: "/pages/other/other?OtherOpenid="+e.currentTarget.dataset.openid
      })
    }
  },

  NavigateBack(){
    wx.navigateBack()
  },
})