// pages/other/other.js
Page({
  data: {
    openid:'',
    avatarUrl:'',
    nickName:'',
    background:'',
    AccountNumber:'',
    currentContentIndex: '0',
    MyGoods:[],
    MyMoments:[],
    ISFriend:''
  },

  onLoad(options) {
    this.setData({openid:options.OtherOpenid})
    const that = this
    wx.cloud.callFunction({
      name:'GetMine',
      data:
      {openid:options.OtherOpenid},
      success:function(res){
        that.setData({
          nickName:res.result.nickName,
          avatarUrl:res.result.avatarUrl,
          MyGoods:res.result.MyGoods.data,
          background:res.result.background,
          AccountNumber:res.result.AccountNumber
        })
        that.GetMineMoments(res.result.Moments_id)
      },
      fail:function(err){
        console.log(err)
      }
    })
    wx.cloud.callFunction({
      name:'JudgeWhetherISFriend',
      data:{
        Myopenid:getApp().globalData.openid,
        OtherOpenid:that.data.openid
      },
      success(res){
        that.setData({ISFriend:res.result})
      },
      fail(err){
        console.error('调用云函数JudgeWhetherISFriend失败',err)
      }
    })
  },

  GetMineMoments:function(Moments_id){
    const that=this
    wx.cloud.callFunction({
      name:'GetMineMoments',
      data:{
        Moments_id:Moments_id,
        myopenid:this.data.openid
      },
      success:function(res){
        that.setData({MyMoments:res.result.data})
      },
      fail:function(err){
        console.log(err)
      }
    })
  },

  AddFriend(){
    const that = this
    const app = getApp()
    wx.cloud.callFunction({
      name:'AddFriend',
      data:{
        myopenid:app.globalData.openid,
        SearchedOpenid:that.data.openid
      },
      success:function(res){
        that.setData({
          ISFriend:'Applicated'
        })
        wx.showToast({
          title: '已发送亲友申请,等待对方验证通过',
          icon:'none'
        })
      },
      fail:function(err){
        console.error('调用申请好友的云函数失败',err)
      }
    })
  },

  GotoNegotiation:function(){
    const that = this
    const app = getApp()
    wx.cloud.callFunction({
      name:'GotoNegotiation',
      data:{
        OtherOpenid:that.data.openid,
        Myopenid:app.globalData.openid
      },
      success(res){
        wx.navigateTo({
          url: '/pages/Negotiationchat/Negotiationchat?AnotherOpenid=' + that.data.openid
        })
      },
      fail(err){
        console.error('调用前往议价的云函数失败',err)
      }
    })
  },

  changeContent: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentContentIndex: index
    });
   },

  goToGoodDetail:function(event){
    console.log(event)
   const productId = event.currentTarget.dataset.id;
   console.log(productId)
   wx.navigateTo({
    url: '/pages/GoodDetail/GoodDetail?id=' + productId
  });
},

  ToMomentDetail:function(e){
    console.log(e)
    let item = e.currentTarget.dataset.index;
    let itemStr = JSON.stringify(item)
    wx.navigateTo({
      url: '/pages/MomentDetail/MomentDetail?_id='+ e.currentTarget.dataset.index._id
    })
  },
      
  NavigateBack(){
    wx.navigateBack()
  },
})