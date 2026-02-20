// pages/MySelling/MySelling.js
Page({

  data: {
    openid:'',
    avatarUrl:'',
    nickName:'',
    Day:true,
    MySelling:[]
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
      name:'GetMySelling',
      data:{
        openid:that.data.openid
      },
      success(res){
        wx.hideLoading()
        that.setData({
          MySelling:res.result.data
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
       content: '要删除该商品吗？',
       complete: (res) => {
         if (res.cancel) {
         }
         if (res.confirm) {
           wx.cloud.callFunction({
             name:'DeleteGood',
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