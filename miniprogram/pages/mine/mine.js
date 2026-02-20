// pages/mine/mine.js
Page({
  data: {
    openid:'',
    avatarUrl:'',
    nickName:'',
    background:'',
    AccountNumber:'',
    currentContentIndex: 0,
    currentContentIndexOfGoods: 0,
    currentContentIndexOfMoments:0,
    MyGoods:[],
    MyWant:[],
    MyMoments:[],
    LikingMoments:[],

    Day:true,
    GlobalUnread:0,
  },

  onLoad(options) {
    this.setData({
      GlobalUnread:  getApp().globalData.Unreads
    })
    const that = this
    const app = getApp()
    if(getApp().globalData.SavedMine.openid){

      this.setData(getApp().globalData.SavedMine)

     
     }else{

    this.setData({
      openid:app.globalData.openid,
      AccountNumber:app.globalData.AccountNumber,
      avatarUrl:app.globalData.avatarUrl,
      nickName:app.globalData.nickName,
      Day:app.globalData.Day,
    })
    wx.cloud.callFunction({
      name:'GetMine',
      data:
      {openid:that.data.openid},
      success:function(res){
        console.log('我想要的',res.result.MyWant.data)
        that.setData({
          MyGoods:res.result.MyGoods.data,
          MyWant:res.result.MyWant.data,
          background:res.result.background,
        })
        console.log(res.result)
      },
      fail:function(err){
        console.log(err)
      }
    })

  }
  },

  onShow(){
    console.log(getApp().globalData.avatarUrl,getApp().globalData.nickName)
    this.setData({
      GlobalUnread:  getApp().globalData.Unreads,
      avatarUrl: getApp().globalData.avatarUrl,
      nickName:getApp().globalData.nickName
    })
  },

  changeContent: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentContentIndex: index
    });
   },
  
   MainSwiperChange:function(e){
    this.setData({
      currentContentIndex:e.detail.current
   })
   },

  changeContentOfGoods:function(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentContentIndexOfGoods: index
    });
  },
  
  changeContentOfMoments:function(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentContentIndexOfMoments: index
    });
  },

  onSwiperChangeOfGoods:function(e){
    this.setData({currentContentIndexOfGoods:e.detail.current})
  },
  
  onSwiperChangeOfMoments:function(e){
    this.setData({currentContentIndexOfMoments:e.detail.current})
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
      
  ChangeDayAndNight:function(){
    this.setData({
      Day:!this.data.Day
    })
    getApp().globalData.Day = this.data.Day
  },

  ToSettings(){
    wx.navigateTo({
      url: '/pages/settings/settings',
    })
  },

  ToMySelling(){
    wx.navigateTo({
      url: '/pages/MySelling/MySelling',
    })
  },

  ToMyWant(){
    wx.navigateTo({
      url: '/pages/MyWant/MyWant',
    })
  },

  ToMyMoments(){
    wx.navigateTo({
      url: '/pages/MyMoment/MyMoment',
    })
  },

  ToMyLiking(){
    wx.navigateTo({
      url: '/pages/MyLiking/MyLiking',
    })
  },

  ToShopping:function(){
    getApp().globalData.SavedMine = this.data
    wx.redirectTo({
      url: '/pages/shopping/shopping',
    })
  },

  ToSquare:function(){
    getApp().globalData.SavedMine = this.data
    wx.redirectTo({
      url: '/pages/square/square',
    })
},

ToMessage:function(){
  getApp().globalData.SavedMine = this.data
  wx.redirectTo({
    url: '/pages/messages/message',
  })
},

previewImage: function() {
  wx.previewImage({
    urls: [this.data.avatarUrl], // 数组中放入需要预览的图片链接
    current: this.data.avatarUrl // 当前显示图片的链接
  });
}
})