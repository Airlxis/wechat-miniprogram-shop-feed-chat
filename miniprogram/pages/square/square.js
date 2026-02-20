// pages/square/square.js
Page({
  data: {
    //界面交互变量
    currentContentIndex:'0',

    //动态加载数据    
    InputContent:'',
    FilteredInput:[],
    Moments:[],
    pages:0,
    hasMoreData: true,
    istriggered:null,

    //动态编辑的数据
    Text:'',
    ImagePaths:[],
    ImageFileIDs:[],
    Tag:[
      {value:'灌水闲聊',checked:false},
      {value:'cos搭子',checked:false},
      {value:'一起逛展',checked:false},
      {value:'同人交流',checked:false},
    ],
    ChoosedTag:'',
    TagChoosing:false,

    //页面浏览记录
    scrollTop:0,
    GlobalUnread:0,

    //动态详情传输
    receviedFromMomentDetail:{}
  },

onLoad(options) {
  if(getApp().globalData.SavedSquare.Moments){
    this.setData(getApp().globalData.SavedSquare)
   }else{

    const that = this
    const app = getApp()

    wx.showLoading({
      title:'加载动态'
    })
    wx.cloud.callFunction({
      name:'GetMoments',
      data:{
        myopenid:app.globalData.openid,
        pages:0
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
  }
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
    GlobalUnread:  getApp().globalData.Unreads,
    Moments:Moments
  })
},

changeContent: function(e) {
  const index = e.currentTarget.dataset.index;
  this.setData({
    currentContentIndex: index
  });
 },

changeswip(e){
   console.log(e.detail.current)
   const number = e.detail.current
   const string = number.toString()
   this.setData({currentContentIndex:string})
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
      pages:0
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

ToSendMoment:function(e){
    wx.navigateTo({
      url: '/pages/SendMoment/SendMoment',
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

GoToTag(e){
  wx.navigateTo({
    url: '/pages/TagDetail/TagDetail?Tag=' + e.currentTarget.dataset.index
  })
},

//发送和编辑动态
input:function(e){
  this.setData({Text:e.detail.value})
},

ChooseImage:function(){
  const that = this;
wx.chooseMedia({
  count: 9, // 用户最多可以选择的图片数量
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success(res) {
    that.setData({
      ImagePaths: res.tempFiles.map(file => file.tempFilePath)
    })
  }
})
},

ShowTagChoosing(){
  this.setData({TagChoosing:true})
},

ChooseTag(e){
  const ChoosedTagsArray = this.data.Tag.map(item =>{
    if(item.value === e.currentTarget.dataset.index){
      return {...item, checked:true}
    }
    if(item.value !== e.currentTarget.dataset.index){
      return {...item, checked:false}
    }
    return item
  })
  this.setData({
    Tag:ChoosedTagsArray,
    ChoosedTag:e.currentTarget.dataset.index
  })
},

StartSend(){
  this.setData({TagChoosing:false})
  this.UpLoadImage()
},

UpLoadImage: function(){
  wx.showLoading({
    title: '发送中',
  })
  let ImagePaths = this.data.ImagePaths
  let fileIDs = []
  if(ImagePaths.length!==0){
    for (let i = 0; i < ImagePaths.length; i++) {
      let filePath = ImagePaths[i]
      // 使用wx.cloud.uploadFile方法上传图片
      wx.cloud.uploadFile({
        cloudPath: `images/${Date.now()}-${Math.random() * 1000000}.png`, // 建议使用唯一的文件名
        filePath: filePath, // 本地文件路径
        success: res => {
          // 返回文件的fileID
          fileIDs.push(res.fileID)
          // 当所有图片都上传完毕后，你可以进行下一步操作
          if (fileIDs.length === ImagePaths.length) {
            console.log('所有图片上传完成', fileIDs)
            this.setData({ImageFileIDs:fileIDs})
            this.CheckContent()
          }
        },
        fail: err => {
          // 如果上传失败，可以在这里处理错误
          console.error('上传失败', err)
        }
      })
    }
  }else{
    this.CheckContent()
  }
 },

CheckContent(){
  if(this.data.ImageFileIDs.length === 0 || this.data.Text === ''){
    wx.hideLoading()
    wx.showToast({
      title: '请输入图片与文字',
      icon:'none'
    })
  }else{
    this.Send()
  }
  
},

 Send:function(){
  const that = this
  const app = getApp()
  const now = new Date(); 
  const year = now.getFullYear();
  const month = now.getMonth() + 1; 
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');  
  const formattedTimeString = `${year}-${monthStr}-${dayStr} ${hoursStr}:${minutesStr}`; 
  console.log(app.globalData.openid)
  wx.cloud.callFunction({
    name:'SendMoment',
    data:{
      Text:this.data.Text,
      ImageFileIDs:this.data.ImageFileIDs,
      InSquare:this.data.InSquare,
      openid:app.globalData.openid,
      time:formattedTimeString,
      now:Date.parse(now),
      Like:[],
      Tag:this.data.ChoosedTag
    },
    success:function(res){
      if(res.result.success){
        console.log(res)
        wx.showToast({
        title: '发送成功',
        icon:'none'
       })

       that.setData({
        Text:'',
        ImagePaths:[],
        ImageFileIDs:[],
        ChoosedTag:''
       })
      wx.hideLoading()
      }else{
        console.error(res.result.error)
        wx.hideLoading()
      }
    },
    fail:function(err){
      console.error('调用发送说说的云函数失败',err)
    }
  })
},


//导航栏
ToShopping:function(){
  const that = this

  const query = wx.createSelectorQuery();
  query.select('#MomentScrollView').scrollOffset();
  query.exec((res) => {

    // res[0] 包含滚动视图的滚动位置信息
    const scrollTop = res[0].scrollTop;

    // 将滚动位置保存到全局变量或者本地存储
    that.setData({scrollTop:scrollTop})
    
    getApp().globalData.SavedSquare = that.data

    wx.redirectTo({
      url: '/pages/shopping/shopping',
    })
  });

},

ToMessage:function(){
  const that = this

  const query = wx.createSelectorQuery();
  query.select('#MomentScrollView').scrollOffset();
  query.exec((res) => {

    // res[0] 包含滚动视图的滚动位置信息
    const scrollTop = res[0].scrollTop;

    // 将滚动位置保存到全局变量或者本地存储
    that.setData({scrollTop:scrollTop})
    
    getApp().globalData.SavedSquare = that.data

    wx.redirectTo({
      url: '/pages/messages/message',
    })
  });

},

ToMine:function(){
  const that = this

  const query = wx.createSelectorQuery();
  query.select('#MomentScrollView').scrollOffset();
  query.exec((res) => {

    // res[0] 包含滚动视图的滚动位置信息
    const scrollTop = res[0].scrollTop;

    // 将滚动位置保存到全局变量或者本地存储
    that.setData({scrollTop:scrollTop})
    
    getApp().globalData.SavedSquare = that.data

    wx.redirectTo({
      url: '/pages/mine/mine',
    })
  });


},
})