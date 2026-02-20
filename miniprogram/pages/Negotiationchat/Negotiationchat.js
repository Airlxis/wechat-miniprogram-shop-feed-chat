// pages/Negotiationchat/Negotiationchat.js
Page({


  data: {
    AnotherOpenid:'',
    AnotherAvatarUrl:'',
    AnotherNickName:'',
    MyOpenid:'',
    MyAvatarUrl:'',
    MyNickName:'',
    scrollTop:0,
    Messages:[],
    inputValue:'',
    MessageToSend:'',
    ImagePath:'',
    ImageFileID:''
  },

  onLoad(options) {
    const that = this
    const app = getApp()
    that.setData({
      AnotherOpenid:options.AnotherOpenid,
      MyOpenid:app.globalData.openid,
      MyAvatarUrl:app.globalData.avatarUrl,
      MyNickName:app.globalData.nickName
    })

    wx.cloud.callFunction({
      name:'InfoInPrivateChat',
      data:{AnotherOpenid:that.data.AnotherOpenid},
      success:function(res){
        that.setData({AnotherAvatarUrl:res.result.avatarUrl,
        AnotherNickName:res.result.nickName})
      },
      fail:function(err){
        console.error('调用获取对方昵称头像的云函数失败',err)
      }
    })

    wx.showLoading({
      title: '加载聊天记录',
    })
    wx.cloud.callFunction({
      name:'NegotiationChatHistory',
      data:{
        CurrentMessagesNumber:that.data.Messages.length,
        AnotherOpenid:that.data.AnotherOpenid,
        MyOpenid:that.data.MyOpenid
      },
      success:function(res){
        console.log(res.result)
        that.setData({Messages:that.data.Messages.concat(res.result) }, () => {
          // 数据更新后，执行滚动指令
          that.scrollToBottom();})
        wx.hideLoading()
      },
      fail:function(err){
        console.error('调用获取交易聊天记录的云函数失败',err)
      }
    })
    that.startwatching()
  },
 
  onShow(){
    const that = this
    wx.cloud.callFunction({
      name:'ClearUnreadNeo',
      data:{
        AnotherOpenid:that.data.AnotherOpenid,
        MyOpenid:that.data.MyOpenid
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
      name:'ClearUnreadNeo',
      data:{
        AnotherOpenid:that.data.AnotherOpenid,
        MyOpenid:that.data.MyOpenid
      },
      success(res){
        console.log('yesiii')
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
      that.setData({
        scrollTop: rect.height 
      });
    }).exec();
  },

  previewImage(e){
    console.log(e)
    wx.previewImage({
      urls: [e.currentTarget.dataset.image], // 数组中放入需要预览的图片链接
      current: e.currentTarget.dataset.image // 当前显示图片的链接
    });
  },

  startwatching:function(){
    const that = this;
    const db = wx.cloud.database()

    let initialized = false;
 db.collection('NegotiationChat').where({
    Bargainer: db.command.all([that.data.AnotherOpenid, that.data.MyOpenid])
  }).watch({
    onChange: function(snapshot) {
      if (!initialized) {
        initialized = true;
        return; // 在初始化时直接返回，不执行后续代码
      }  
        let message = snapshot.docs[0].Message
        let newmessage = message[message.length - 1]
        console.log('新消息',newmessage)
        that.setData({ Messages:[newmessage].concat(that.data.Messages)})          
    },
    onError: function(err) {
      console.error('监听出错', err);
    }
  });
  },

  input:function(e){
    this.setData({MessageToSend:e.detail.value})
  },

  AskForMoreHistory:function(e){
    const that = this
    wx.cloud.callFunction({
      name:'NegotiationChatHistory',
      data:{
        CurrentMessagesNumber:that.data.Messages.length,
        AnotherOpenid:that.data.AnotherOpenid,
        MyOpenid:that.data.MyOpenid
      },
      success:function(res){
        console.log(res)
        that.setData({Messages:that.data.Messages.concat(res.result)})
        that.UpdatePhotoPreview()
      },
      fail:function(err){
        console.error('调用获取私聊聊天记录的云函数失败',err)
      }
    })
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
        name:'SendMessageInNegotiationChat',
        data:{
          AnotherOpenid:that.data.AnotherOpenid,
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
    const cloudPath = 'PrivateChatImage/' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000) + that.data.MyOpenid;
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
      name:'SendMessageInNegotiationChat',
      data:{
        AnotherOpenid:that.data.AnotherOpenid,
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