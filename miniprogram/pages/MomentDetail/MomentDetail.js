// pages/MomentDetail/MomentDetail.js
Page({

  data: {
    _id:'',
    OtherOpenid:'',
    SenderProfile:{},
    Moment:{},
    MessageToSend:'',
    Comments:[],
    LikeNumber:'',
    CommentNumber:'',
    liked:null,
    inputvalue:''
  },

  onLoad(options) {
    const that = this
    console.log('test',options._id)
    that.setData({
      _id:options._id
    })
    that.GetMomentDetail()
  },
  
  onUnload: function() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 获取上一个页面
    if (prevPage) {
      prevPage.setData({
        receviedFromMomentDetail: {
          id:this.data._id,
          liked:this.data.liked,
          LikeNumber:this.data.LikeNumber,
          CommentNumber:this.data.CommentNumber
        }
      });
    }
  },
 
  ToOther:function(e){
    const app = getApp()
    console.log(e.currentTarget.dataset.openid)
    if(this.data.SenderProfile.openid === app.globalData.openid){
      console.log('这是自己的')
      return
    }else{
      wx.navigateTo({
        url: "/pages/other/other?OtherOpenid="+e.currentTarget.dataset.openid
      })
    }
  },

  GetMomentDetail:function(){
    const that = this
    const app = getApp()
    wx.showLoading()
    wx.cloud.callFunction({
      name:'GetMomentDetail',
      data:{
        myopenid:app.globalData.openid,
        _id:that.data._id
      },
      success:function(res){
        if(res.result.success){
          console.log(res)
          that.setData({
            Moment:res.result.data.result.data,
            Comments:res.result.data.newMessagesArray,
            SenderProfile:res.result.data.SenderProfile.data[0],
            LikeNumber:res.result.data.LikeNumber,
            CommentNumber:res.result.data.CommentNumber,
            liked:res.result.data.liked
          })
        }else{
          console.error('获取说说详情的云函数错误',res.result.error)
        }
        wx.hideLoading()
      },
      fail:function(err){
        wx.hideLoading()
        console.error('调用获取说说详情的云函数失败',err)
      }
    })
  },

  GiveLike: function(e){
wx.showLoading()
    const now = new Date()
    const that = this
    const app = getApp()
    wx.cloud.callFunction({
      name:'GiveLike',
      data:{
        _id:that.data._id,
        openid:app.globalData.openid,
        TimeID:now.getTime()
      },
      success:function(res){
        wx.hideLoading()
        console.log('点赞成功',res.result)
        that.setData({
          liked:true,
          LikeNumber:that.data.LikeNumber+1
        })
      },
      fail:function(err){
        wx.hideLoading()
        console.error('调用点赞的云函数失败',err)
      }
    })

  },
  
  CancleLike: function(e){
    wx.showLoading()
    const that = this
    const app = getApp()
    wx.cloud.callFunction({
      name:'CancleLike',
      data:{
        _id:that.data._id,
        openid:app.globalData.openid
      },
      success:function(res){
        that.setData({
          liked:false,
          LikeNumber:that.data.LikeNumber-1
        })
        wx.hideLoading()
      },
      fail:function(err){
        wx.hideLoading()
        console.error('调用点赞的云函数失败',err)
      }
    })
  },

  input:function(e){
    this.setData({MessageToSend:e.detail.value})
  },
  
  SendComment:function(e){
      const that = this
            const app = getApp()
            const now = new Date(); 
            const year = now.getFullYear();
            const month = now.getMonth() + 1; 
            const day = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const monthStr = month.toString().padStart(2, '0');
            const dayStr = day.toString().padStart(2, '0');
            const hoursStr = hours.toString().padStart(2, '0');
            const minutesStr = minutes.toString().padStart(2, '0');  
            const formattedTimeString = `${year}-${monthStr}-${dayStr} ${hoursStr}:${minutesStr}`;
            wx.cloud.callFunction({
              name:'SendComment',
              data:{
                _id:that.data._id,
                openid:app.globalData.openid,
                time:formattedTimeString,
                now:now,
                content:that.data.MessageToSend
              },
              success:function(res){
                that.setData({inputvalue:''})
                that.GetMomentDetail()
                wx.showToast({
                  title: '评论成功',
                  icon:'none'
                })  
              },
              fail:function(err){
                console.error('调用评论的云函数失败',err)
              }
      });
    },

    NavigateBack(){
      wx.navigateBack()
    },  
})