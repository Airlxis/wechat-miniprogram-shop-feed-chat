// pages/GoodDetail/GoodDetail.js
Page({
data: {
    GoodID:'',
    OtherOpenid:'',
    Myopenid:'',
    MasterNickName:'',
    MasterAvatarUrl:'',
    nickName:'',
    gender:'',
    avatarUrl:'',
    MainImageFileID:'',
    MainIntroduction:'',
    MoreImageFileID:'',
    DetailIntroduction:'',
    Price:'',   
    inputValue:'',
    MessageToSend:'',
    Messages:'',
    HandeledMessages:'',
    IfWant:null
},

onLoad(options) {
    if (options) {
      this.setData({
        GoodID: options.id
      });
    }
    this.setData({
      Myopenid: getApp().globalData.openid,
      nickName: getApp().globalData.nickName,
      gender: getApp().globalData.gender,
      avatarUrl: getApp().globalData.avatarUrl
    })  
    this.AskForGoodDetail()
},

ToOther:function(e){
  const app = getApp()
  console.log(e.currentTarget.dataset.openid)
  if(this.data.OtherOpenid === app.globalData.openid){
    console.log('这是自己的')
    return
  }else{
    wx.navigateTo({
      url: "/pages/other/other?OtherOpenid="+e.currentTarget.dataset.openid
    })
  }
},

AskForGoodDetail:function(){
  wx.showLoading({
    title: '加载中',
  })
  const that = this
  const app = getApp()
  wx.cloud.callFunction({
    name:'AskForGoodDetail',
    data:{
      id:that.data.GoodID,
      openid: app.globalData.openid
    },
    success:function(res){
     if (res.result.success) {
     console.log('adwda',res.result)
     const detail = res.result.GoodDetail
     const profile = res.result.GoodMasterProfile
     let IfWant;
     if (detail.hasOwnProperty('WhoWant')) {
      IfWant = detail.WhoWant.includes(app.globalData.openid)
     } else {
      IfWant = false
     }
     that.setData({
       MainImageFileID:detail.MainImageFileID,
       MainIntroduction:detail.MainIntroduction,
       MoreImageFileID:detail.MoreImageFileID,
       DetailIntroduction:detail.DetailIntroduction,
       Price: detail.Price,
       Messages: detail.Messages,
       IfWant:IfWant,
       OtherOpenid:detail.openid,
       MasterNickName:profile.nickName,
       MasterAvatarUrl:profile.avatarUrl
     })
     wx.hideLoading()
     that.GetSenderProfile()    
     }else{
      console.error('获取商品细节失败：', res.result.message);
     }
    },
    fail:function(error){
      console.error('调用获取商品细节的云函数失败：', err);}
 })
},

GetSenderProfile:function(){
  var that = this
  const openids = [...new Set(that.data.Messages.map(item => item.openid))];
  wx.cloud.callFunction({
    name:'GetSenderProfile',
    data:{
      openids:openids,
      Messages:that.data.Messages
    },
    success:function(res){
      if (res.result.success){
        console.log(res)
        const NoHandeledMessages=res.result.data
        const HandeledMessages = NoHandeledMessages.map((item, index) => {
          const uniqueId = Date.now().toString() + index.toString();
          return { ...item, id: uniqueId };        
        });
        that.setData({HandeledMessages:HandeledMessages.sort((a, b) => {
          const timeA = new Date(a.time);
          const timeB = new Date(b.time);
          return timeA - timeB || a.id - b.id; 
        })})
      }else{
        console.error(res.result.error)
      }
    },
    fail:function(err){
       console.error('调用处理昵称头像的云函数失败',err)
    }

  })
},

GotoNegotiation:function(){
  const that = this
  const app = getApp()
  wx.cloud.callFunction({
    name:'GotoNegotiation',
    data:{
      OtherOpenid:that.data.OtherOpenid,
      Myopenid:app.globalData.openid
    },
    success(res){
      wx.navigateTo({
        url: '/pages/Negotiationchat/Negotiationchat?AnotherOpenid=' + that.data.OtherOpenid
      })
    },
    fail(err){
      console.error('调用前往议价的云函数失败',err)
    }
  })
},

Want:function(e){
  const app = getApp()
  const that = this
  wx.cloud.callFunction({
    name:'AddWant',
    data:{
      GoodID:that.data.GoodID,
      openid:app.globalData.openid
    },
    success:function(res){
      that.setData({
        IfWant:!that.data.IfWant
      })
      console.log(res)
      wx.showToast({
        title: '已成功收藏',
        icon:'none'
      })
    },
    fail:function(err){
      console.error('调用收藏的云函数失败',err)
    }
  })
},

NotWant:function(e){
  const app = getApp()
  const that = this
  wx.cloud.callFunction({
    name:'CancelWant',
    data:{
      GoodID:that.data.GoodID,
      openid:app.globalData.openid
    },
    success:function(res){
      that.setData({
        IfWant:!that.data.IfWant
      })
      console.log(res)
      wx.showToast({
        title: '已取消收藏',
        icon:'none'
      })
    },
    fail:function(err){
      console.error('调用收藏的云函数失败',err)
    }
  })
},

input:function(e){
  this.setData({MessageToSend:e.detail.value})
},

LeaveMessage:function(e){
  var that = this
	const now = new Date(); 
  const year = now.getFullYear();
  const month = now.getMonth() + 1; 
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');  
  const secondsStr = seconds.toString().padStart(2, '0');
  const formattedTimeString = `${year}-${monthStr}-${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`; 
  const app = getApp()
  const newRecord = {
    openid: app.globalData.openid, 
    content: that.data.MessageToSend,
    time: formattedTimeString
    };
  console.log(newRecord)
  wx.cloud.callFunction({
    name:'LeaveMessageForGoods',
    data:{
      Message:newRecord,
      GoodID:that.data.GoodID
    },
    success:function(res){
      if (res.result.success) {
        wx.showToast({
          title: '留言成功',
          icon:'none'
        })
        console.log(res)
        that.setData({inputValue:''})
        that.onLoad()

        } else {
        wx.showToast({
          title: '留言失败',
          icon:'none'
        })
        console.error(res.result.error)
      }
    },
    fail:function(err){
      console.error('调用留言的云函数失败',err)
    }
  })
},

NavigateBack(){
  wx.navigateBack()
},
})