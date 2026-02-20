// pages/TagDetail/TagDetail.js
Page({

  data: {
    Tag:'',

    InputContent:'',
    FilteredInput:[],
    Moments:[],
    pages:0,
    hasMoreData: true,
  },

  onLoad(options) {
    this.setData({Tag:options.Tag})
    const that = this
    const app = getApp()

    wx.showLoading({
      title:'加载动态'
    })
    wx.cloud.callFunction({
      name:'GetMoments',
      data:{
        myopenid:app.globalData.openid,
        pages:0,
        Tag:options.Tag
      },
      success:function(res){
        console.log('test',res)
        if(res.result.success){
        const mergedArray = [...Object.values(res.result.data)];
        console.log(mergedArray)
        mergedArray.forEach(item => {
          let parts = item.Time.split(" ")
          let datestring = parts[0]
          let timestring = parts[1]
          let datedetail = datestring.split("-")
          let result = datedetail[1] + "-" + datedetail[2] + " " + timestring
          item.Time = result
        })
        that.setData({
          Moments:mergedArray,
        })
        wx.hideLoading()
        if(that.data.pages===0){
          that.setData({
            pages:1,
          })
        }

          if(mergedArray.length<30){
            that.setData({
              hasMoreData: false
            })
          }
        }else{
          console.error(res.result.error)
        }
      },
      fail:function(err){
        console.error('调用获取说说的云函数失败',err)
      }
    })
  },

  onShow() {

  },

  PullRefresh(){
    this.setData({
      istriggered:true,
      InputContent:'',
      FilteredInput:[],
      Moments:[],
      pages:0,
      hasMoreData: true,
    })
    const that = this
    const app = getApp()
  
    wx.showLoading({
      title:'重新刷新'
    })
    wx.cloud.callFunction({
      name:'GetMoments',
      data:{
        myopenid:app.globalData.openid,
        pages:0,
        Tag:that.data.Tag
      },
      success:function(res){
        if(res.result.success){
        const mergedArray = [...Object.values(res.result.data)];
        console.log(mergedArray)
        mergedArray.forEach(item => {
          let parts = item.Time.split(" ")
          let datestring = parts[0]
          let timestring = parts[1]
          let datedetail = datestring.split("-")
          let result = datedetail[1] + "-" + datedetail[2] + " " + timestring
          item.Time = result
        })
        that.setData({
          Moments:mergedArray,
        })
        wx.hideLoading()
        if(that.data.pages===0){
          that.setData({
            pages:1,
          }) 
        }
  
          if(mergedArray.length<30){
            that.setData({
              hasMoreData: false
            })
          }
        }else{
          console.error(res.result.error)
        }
      },
      fail:function(err){
        console.error('调用获取说说的云函数失败',err)
      }
    })
    that.setData({
      istriggered:false
    })
  },

  SearchMoment:function(e){
   
    const FilteredInput = this.data.Moments.filter(item => {
     return item.Text.includes(e.detail.value);	});
     this.setData({
       InputContent:e.detail.value,
       FilteredInput:FilteredInput
      })
     console.log('输入',e.detail.value,'得到',FilteredInput)
  },
 
  loadMore: function () {
     if (this.data.hasMoreData ) {
       const that = this
       const app = getApp()
       wx.showLoading({
         title:'加载更多'
       })
       wx.cloud.callFunction({
         name:'GetMoments',
         data:{
           myopenid:app.globalData.openid,
           pages:that.data.pages,
         },
         success:function(res){
           if(res.result.success){
           const mergedArray = [...Object.values(res.result.data)];
           console.log(mergedArray)
             that.setData({
             Moments:that.data.Moments.concat(mergedArray),
             pages:that.data.pages+1
           }) 
           wx.hideLoading()
             if(mergedArray.length<30){
               that.setData({
                 hasMoreData: false
               })
             }
           }else{
             console.error(res.result.error)
           }
         },
         fail:function(err){
           console.error('调用获取说说的云函数失败',err)
         }
       })
     }
 },

 NavigateBack(){
  wx.navigateBack()
},
})