// pages/IPdetail/IPdetail.js
Page({

data: {
  IP:'',
  ChatGroups:[],
  NewGroupName:'',
  AddGroupPhoto:false,
  avatarpath:'',
  avatarfileID:''
},

onLoad(options) {
  wx.showLoading()
  console.log('IP为',options._id)
  this.setData({IP:options._id})
  this.Refresh()
},

Refresh:function(){
  const that = this
  const app = getApp()
  wx.cloud.callFunction({
    name:'GetGroupsInIP',
    data:{
      IP:this.data.IP,
      MyOpenid:app.globalData.openid
    },
    success:function(res){
      console.log(res.result)
      that.setData({
         ChatGroups:res.result
      })
      wx.hideLoading()
    },
    fail:function(err){
      console.error('调用查看该IP下的所有群聊失败',err)
    }
  })
},

CreatNewGroup:function(e){
  const that = this
  wx.showModal({
    title: '输入群聊名称',
    editable: true, 
    success (res) {
      if (res.confirm) {
        console.log('用户输入的群聊名称:', res.content);
        that.setData({
          NewGroupName:res.content,
          AddGroupPhoto:true
        })
      } else if (res.cancel) {
        console.log('用户点击了取消');
      }
    }
  });
},

groupavatar:function(){
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
    }
  })
},

Confirm:function(){
  const that = this
  const cloudpath = "GroupChatAvatar/" + new Date().getTime() + '-' + Math.floor(Math.random() * 100000) + that.data.avatarpath.match(/\.[^.]+?$/)[0] + that.data.openid;
  wx.cloud.uploadFile({
    cloudPath: cloudpath,
    filePath: that.data.avatarpath,
    success(res){
      that.setData({avatarfileID:res.fileID})
      that.Upload()
    }
  })
},

Cancel(){
  this.setData({
    AddGroupPhoto:false,
    avatarpath:''
  })
},
Upload:function(GroupName){
  wx.showLoading({
    title:'创建中'
  })
  const that = this
  const app = getApp()
  const timestamp = new Date().getTime();
  wx.cloud.callFunction({
    name:'CreateNewGroup',
    data:{
      IP:that.data.IP,
      GroupName:that.data.NewGroupName,
      GroupAvatar:that.data.avatarfileID,
      CreaterOpenid:app.globalData.openid,
      timestamp:timestamp
    },
    success:function(res){
      console.log('成功创建群聊')
      that.setData({
        AddGroupPhoto:false,
        avatarpath:'',
        avatarfileID:''
      })
      that.Refresh()
    },
    fail:function(err){
      console.error('调用创建群聊的云函数失败',err)
    }
  })
},

JoinChatGroup:function(e){
  wx.showLoading()
  console.log('想加入的群聊：',e.currentTarget.dataset.index)
  const that = this
  const app = getApp()
  wx.cloud.callFunction({
    name:'JoinChatGroup',
    data:{
      IP:that.data.IP,
      MyOpenid:app.globalData.openid,
      GroupID:e.currentTarget.dataset.index
    },
    success:function(res){
      console.log('成功加入群聊')
      that.Refresh()
      wx.hideLoading()
    },
    fail:function(err){
      console.error('调用加入群聊的云函数失败',err)
      wx.hideLoading()
    }
  })
},

NavigateBack(){
  wx.navigateBack()
},
})