// pages/MyWant/MyWant.js
Page({

  data: {
    openid:'',
    avatarUrl:'',
    nickName:'',
    Day:true,
    MyWant:[]
  },


  onLoad(options) {
    wx.showLoading()
    const app = getApp()
    this.setData({
      openid:app.globalData.openid,
      avatarUrl:app.globalData.avatarUrl,
      nickName:app.globalData.nickName,
      Day:app.globalData.Day
    })

    const that = this
    wx.cloud.callFunction({
      name:'GetMyWant',
      data:{
        openid:that.data.openid
      },
      success(res){
        wx.hideLoading()
        console.log(res)
        that.setData({
          MyWant:res.result.data
        })
      },
      fail(err){
        wx.hideLoading()
        console.error('调用云函数GetMySelling失败',err)
      }
    })

  },

  goToGoodDetail:function(event){
    console.log(event)
   const productId = event.currentTarget.dataset.id;
   console.log(productId)
   wx.navigateTo({
    url: '/pages/GoodDetail/GoodDetail?id=' + productId
  });
},

Delete(e){
  const that = this
   wx.showModal({
     title: '提示',
     content: '要取消收藏该商品吗？',
     complete: (res) => {
       if (res.cancel) {
       }
       if (res.confirm) {
         wx.cloud.callFunction({
           name:'DeleteWant',
           data:{
             GoodID:e.currentTarget.dataset.id,
             openid:that.data.openid
           },
           success(res){
             that.onLoad()
           },
           fail(err){
             console.error('调用云函数DeleteGood失败',err)
           }
         })
       }
     }
   })
},

NavigateBack(){
  wx.navigateBack()
},
})