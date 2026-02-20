// pages/settings/settings.js
Page({

  data: {
    nickName:'',
    avatarUrl:'',
    TochangeAvatar:false,
    avatarpath:'',
    avatarfileID:'',
    TochangeBackground:false,
    backgroundpath:'',
    backgroundfileID:'',
  },

  onLoad(options) {
    const app = getApp()
    this.setData({
      nickName : app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl
    })
  },

  changenickname(){
    wx.showLoading()
    const that = this
    wx.showModal({
      title: '修改昵称',
      editable: true,
      content:that.data.nickName,
      success: function(res) {
        if (res.confirm) {
          console.log('用户输入的内容:', res.content);
          const newname = res.content
          wx.cloud.callFunction({
            name:'ChangeProfile',
            data:{
              openid:getApp().globalData.openid,
              part:'nickName',
              value:res.content
            },
            success(res){
              wx.hideLoading()
              console.log(newname)
              getApp().globalData.nickName = newname
              wx.navigateBack()
            },
            fail(err){
              wx.hideLoading()
              console.error('调用修改昵称的云函数失败',err)
            }
          })
        }
      }
    })
  },

  showchangeavatar(){
    this.setData({TochangeAvatar:true})
  },

  chooseavatar:function(){
    const that = this
    wx.chooseMedia({
      count:1,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success:function(res){
        console.log(res)
        that.setData({
          avatarpath:res.tempFiles[0].tempFilePath,
        })
        that.uploadavatar()
      }
    })
  },
  
  uploadavatar:function(){
    const that = this
    const cloudpath = "UserAvatar/" + new Date().getTime() + '-' + Math.floor(Math.random() * 100000) + that.data.avatarpath.match(/\.[^.]+?$/)[0] + that.data.openid;
    wx.cloud.uploadFile({
      cloudPath: cloudpath,
      filePath: that.data.avatarpath,
      success(res){
        that.setData({avatarfileID:res.fileID})
      }
    })
  },

  changeavatarurl(){
    wx.showLoading()
    const that = this
    wx.cloud.callFunction({
      name:'ChangeProfile',
      data:{
        openid:getApp().globalData.openid,
        part:'avatarUrl',
        value:that.data.avatarfileID
      },
      success(res){
        getApp().globalData.avatarUrl = that.data.avatarfileID
        wx.hideLoading()
        wx.navigateBack()
      },
      fail(err){
        wx.hideLoading()
        console.error('调用修改昵称的云函数失败',err)
      }
    })
  },

  showchangebackground(){
    this.setData({TochangeBackground:true})
  },

  choosebackground:function(){
    const that = this
    wx.chooseMedia({
      count:1,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success:function(res){
        console.log(res)
        that.setData({
          backgroundpath:res.tempFiles[0].tempFilePath,
        })
        that.uploadbackground()
      }
    })
  },
  
  uploadbackground:function(){
    const that = this
    const cloudpath = "UserBackground/" + new Date().getTime() + '-' + Math.floor(Math.random() * 100000) + that.data.backgroundpath.match(/\.[^.]+?$/)[0] + that.data.openid;
    wx.cloud.uploadFile({
      cloudPath: cloudpath,
      filePath: that.data.backgroundpath,
      success(res){
        that.setData({backgroundfileID:res.fileID})
      }
    })
  },

  changebackgroundurl(){
    const that = this
    wx.cloud.callFunction({
      name:'ChangeProfile',
      data:{
        openid:getApp().globalData.openid,
        part:'background',
        value:that.data.backgroundfileID
      },
      success(res){
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      },
      fail(err){
        console.error('调用修改昵称的云函数失败',err)
      }
    })
  },

  ToAgrement(){
    wx.navigateTo({
      url: '/pages/Agrement/Agrement',
    })
  },

  Toprotocol(){
    wx.navigateTo({
      url: '/pages/protocol/protocol',
    })
  },
  
  NavigateBack(){
    wx.navigateBack()
  },
})