// pages/messages/message.js
Page({
  data: {
    index:0,
    show:false,
    MyOpenid:'',

    input:'',

    GroupList:[],
    FilterdGroupList:[],
    GroupUnread:[],
    FilterdGroupUnread:[],

    Friends:[],
    FilterdFriends:[],
    FriendsUnread:[],
    FilterdFriendsUnread:[],

    Bargainers:[],
    FilterdBargainers:[],
    BargainersUnread:[],
    FilterdBargainersUnread:[],

    GlobalUnread:0,
  },

  onLoad(options) {
    this.setData({
      GlobalUnread:  getApp().globalData.Unreads
    })
    if(getApp().globalData.SavedMessages.MyOpenid){

      console.log('获取缓存')
      
      this.setData(getApp().globalData.SavedMessages)
      this.UnreadUpdated()
      getApp().eventEmitter.on('UnreadUpdated', this.UnreadUpdated)
     
     }else{
   
      console.log('重新加载')

      const app = getApp()
    this.setData({
      MyOpenid: app.globalData.openid,
    })
    const that = this
    wx.showLoading({
      title:'加载中'
    })
//group    
    wx.cloud.callFunction({
      name:'GetJoinedGroup',
      data:{
        MyOpenid:app.globalData.openid
      },
      success:function(res){
        console.log(res)
        that.setData({GroupList:res.result})
      },
      fail:function(err){
        console.error('调用获取加入的群聊列表失败',err)
      }
    })

    app.eventEmitter.on('UnreadUpdated', that.UnreadUpdated)

//private
    that.GetFriends()  //获取亲友profile
    that.GetBargainer()  //获取交易profile


    that.UnreadUpdated()

  }
  },
  
  onShow(){
  //每次页面渲染时，刷新一下是否有新好友或群聊
console.log(this.data)

    const that = this
    const db = wx.cloud.database()
    let initialized = false;
    this.watcher = db.collection('User').where({
    openid:getApp().globalData.openid
  }).field({Friends:true,Bargainer:true,ChatGroup:true}).watch({
    onChange: function(snapshot) {
      if (!initialized) {
        initialized = true;
        return; // 在初始化时直接返回，不执行后续代码
      }
      that.UnreadUpdated()
      if(snapshot.docs[0].Friends.length !== that.data.Friends.length){
        console.log('GetFriends')
        that.GetFriends()
      }
      if(snapshot.docs[0].Bargainer.length !== that.data.Bargainers.length){
        console.log('GetBargainer')
        that.GetBargainer()
      }
      if(snapshot.docs[0].ChatGroup.length !== that.data.GroupList.length){
        console.log('GetGroupLtst')
        wx.cloud.callFunction({
          name:'GetJoinedGroup',
          data:{
            MyOpenid:getApp().globalData.openid
          },
          success:function(res){
            console.log(res)
            that.setData({GroupList:res.result})
          },
          fail:function(err){
            console.error('调用获取加入的群聊列表失败',err)
          }
        })
      }
    },
    onError: function(err) {
      console.error('监听出错', err);
    }
  });
  },

  onUnload(){
    console.log('hide')
    // 页面隐藏时停止监听
    if (this.watcher) {
      this.watcher.close();
    }
  },

  searchinput(e){
    const input = e.detail.value
    this.setData({input:input})

    //筛选群聊
    const GroupListWithIndex = this.data.GroupList.map((item,index) =>({
      index:index,
      data:item
    }))

    const FilterdGroupListWithIndex = GroupListWithIndex.filter(item => {
      return item.data.GroupName.includes(input)
    })

    const FilterdGroupList = FilterdGroupListWithIndex.map(item => {
      return item.data
    })

    const FilterdOutGroupsIndex = GroupListWithIndex.filter(
      (item,idx) => !FilterdGroupListWithIndex.some(obj => obj.index === idx)
    ).map(item => item.index)


    const FilterdGroupUnread = this.data.GroupUnread.filter((item,idx) => 
        !FilterdOutGroupsIndex.includes(idx)
     )


    this.setData({
      FilterdGroupList:FilterdGroupList,
      FilterdGroupUnread:FilterdGroupUnread
    }) 


    //筛选好友
    const FriendsWithIndex = this.data.Friends.map((item,index) =>({
      index:index,
      data:item
    }))

    const FilterdFriendListWithIndex = FriendsWithIndex.filter(item => {
      return item.data.nickName.includes(input)
    })

    const FilterdFriendList = FilterdFriendListWithIndex.map(item => {
      return item.data
    })

    const FilterdOutFrinedsIndex = FriendsWithIndex.filter(
      (item,idx) => !FilterdFriendListWithIndex.some(obj => obj.index === idx)
    ).map(item => item.index)


    const FilterdFriendsUnread = this.data.FriendsUnread.filter((item,idx) => 
    !FilterdOutFrinedsIndex.includes(idx)
 )
    this.setData({
      FilterdFriends:FilterdFriendList,
      FilterdFriendsUnread:FilterdFriendsUnread
    })


    //筛选交易
    const BargainersWithIndex = this.data.Bargainers.map((item,index) =>({
      index:index,
      data:item
    }))

    const FilterdBargainerListWithIndex = BargainersWithIndex.filter(item => {
      return item.data.nickName.includes(input)
    })

    const FilterdBargainerList = FilterdBargainerListWithIndex.map(item => {
      return item.data
    })

    const FilterdOutBargainersIndex = BargainersWithIndex.filter(
      (item,idx) => !FilterdBargainerListWithIndex.some(obj => obj.index === idx)
    ).map(item => item.index)


    const FilterdBargainersUnread = this.data.BargainersUnread.filter((item,idx) => 
    !FilterdOutBargainersIndex.includes(idx)
 )

    this.setData({
      FilterdBargainers:FilterdBargainerList,
      FilterdBargainersUnread:FilterdBargainersUnread
    })


  },


//group  
  UnreadUpdated(){
    console.log('要打印的内容')
    this.setData({
      GroupUnread:getApp().globalData.GroupUnread,
      FriendsUnread: getApp().globalData.FriendUnread,
      BargainersUnread: getApp().globalData.BargainerUnread,
      GlobalUnread: getApp().globalData.Unreads
    })
  },

  ToGroupChat:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/GroupChatting/GroupChatting?GroupID='+e.currentTarget.dataset.id
    })
  },


GetFriends(){
  const that = this
  const app = getApp()
  wx.cloud.callFunction({
  name:'GetFriends',
  data:{myopenid:app.globalData.openid},
  success:function(res){
    console.log('亲友：',res.result)
    that.setData({Friends:res.result})
  },
  fail:function(err){
    console.error('调用查看亲友的云函数失败',err)
  },
})},

GetBargainer(){
  const that = this
  const app = getApp()
  wx.cloud.callFunction({
    name:'GetBargainer',
    data:{myopenid:app.globalData.openid},
    success:function(res){
      console.log('交易：',res.result)
      that.setData({Bargainers:res.result})
      wx.hideLoading()
    },
    fail:function(err){
      console.error('调用查看交易者的云函数失败',err)
    },
  })
},

ToFriendChat:function(e){
  console.log(e.currentTarget.dataset.openid)                   
  wx.navigateTo({
    url: '/pages/Friendchat/Friendchat?AnotherOpenid='+ e.currentTarget.dataset.openid
  })
},

ToBargainerChat:function(e){
  console.log(e.currentTarget.dataset.openid)                   
  wx.navigateTo({
    url: '/pages/Negotiationchat/Negotiationchat?AnotherOpenid='+ e.currentTarget.dataset.openid
  })
},


changeindex0:function(){
  this.setData({
    index:0
  })
},

changeindex1:function(){
  this.setData({
    index:1
  })
},

changeindex2:function(){
  this.setData({
    index:2
  })
},

showthe:function(){
  this.setData({
    show:!this.data.show
  })
},

ToJoinGroup(){
  wx.navigateTo({
    url: '/pages/AddGroup/AddGroup',
  })
},

ToAddFriend(){
  wx.navigateTo({
    url: '/pages/Application/Application',
  })
},

ToShopping:function(){
  const that = this
  getApp().globalData.SavedMessages = that.data
  wx.redirectTo({
    url: '/pages/shopping/shopping',
  })
},

ToSquare:function(){
  const that = this
  getApp().globalData.SavedMessages = that.data
  wx.redirectTo({
    url: '/pages/square/square',
  })
},

ToMine:function(){
  const that = this
  getApp().globalData.SavedMessages = that.data
  wx.redirectTo({
    url: '/pages/mine/mine',
  })
}
})