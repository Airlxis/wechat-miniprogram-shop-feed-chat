// pages/MyMoment/MyMoment.js
Page({

  data: {
    Moments:[],
    receviedFromMomentDetail:{}
  },

 
  onLoad(options) {
    wx.showLoading()
    const openid = getApp().globalData.openid
    const that = this
    wx.cloud.callFunction({
      name:'GetMineMoments',
      data:{
        myopenid:openid
      },
      success(res){
        console.log(res.result)
        that.setData({Moments:res.result})
        wx.hideLoading()
      },
      fail(err){
        wx.hideLoading()
        console.error('调用云函数GetMineMoments失败',err)
      }
    })

  },

  onShow(){
    const receviedFromMomentDetail = this.data.receviedFromMomentDetail
    console.log(receviedFromMomentDetail)
    let Moments = this.data.Moments.map(item => {
      if(item._id === this.data.receviedFromMomentDetail.id){
        item.liked = receviedFromMomentDetail.liked
        item.LikeNumber = receviedFromMomentDetail.LikeNumber
        item.CommentNumber = receviedFromMomentDetail.CommentNumber
      }
      return item
    })
    this.setData({
      Moments:Moments
    })
  },

  ToMomentDetail:function(e){
    console.log(e)
    let item = e.currentTarget.dataset.index;
    let itemStr = JSON.stringify(item)
    wx.navigateTo({
      url: '/pages/MomentDetail/MomentDetail?_id='+ e.currentTarget.dataset.index._id
    })
  },

  Delete(e){
    console.log(e.currentTarget.dataset.index)
    const that = this
     wx.showModal({
       title: '提示',
       content: '要删除该动态吗？',
       complete: (res) => {
         if (res.cancel) {
         }
         if (res.confirm) {
           wx.cloud.callFunction({
             name:'DeleteMoment',
             data:{
               MomentID:e.currentTarget.dataset.index._id,
               openid:getApp().globalData.openid
             },
             success(res){
               that.onLoad()
             },
             fail(err){
               console.error('调用云函数DeleteMoment失败',err)
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