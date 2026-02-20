// pages/AddGoods/AddGoods.js
Page({

  data: {
    openid:'',
    MainImagePath:'',
    MoreImagePaths:[],
    AllIP:[],
    filteredIPs:[],
    SelectedIP:'无',
    index1: 0,
    AllType:[
      '谷子' ,
      '手办' ,
      '玩偶' ,
      '漫画' ,
      '衣包' ,
      '小说' ,
      'cos'  ,
      '更多'
     ],
    SelectedType:'无',
    index2: 0,
    MainIntroduction:'',
    DetailIntroduction:'',
    Price:null,
    MainImageFileID:'',
    MoreImageFileID:[],
  },

onLoad(options) {
    var that = this;
    const app = getApp();
    that.setData({
      openid:  app.globalData.openid 
    })
    wx.cloud.callFunction({
      name:'GetAllIPs',
      success:function(res){
        console.log(res.result.data)
        let combinedArray = Object.values(res.result.data).reduce((acc, arr) => {
          return acc.concat(arr);
          }, []);
         that.setData({AllIP:combinedArray})
         that.setData({filteredIPs:that.data.AllIP})
   },
  fail:function(error){
    console.error('调用云函数获取所有IP失败：', err);
  }
})
},

ChooseMainImage: function () {
  const that = this;
  wx.chooseMedia({
    count: 1, 
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      console.log(res)
      that.setData({
        MainImagePath: res.tempFiles[0].tempFilePath
      });
    }
  });
},

ChooseMoreImage: function () {
  const that = this;
  wx.chooseMedia({
    count: 9, // 用户最多可以选择的图片数量
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      // 更新图片路径
      that.setData({
        MoreImagePaths: res.tempFiles.map(file => file.tempFilePath)
      })
    }
  })
      
},

onSearchInput: function(e) {
  const value = e.detail.value.toLowerCase(); 
  let filteredIPs = this.data.AllIP.filter(AllIP => {
    return AllIP.toLowerCase().includes(value); 
  });
  this.setData({
    filteredIPs: filteredIPs 
  });
},

onIPpickerChange: function(e) {
  this.setData({
    index1: e.detail.value,
  });
  const index1 = this.data.index1
  this.setData({
    SelectedIP:this.data.filteredIPs[index1]
  });

},

onTpyePickerChange: function(e) {
  this.setData({
    index2: e.detail.value
  });
  const index2 = this.data.index2
  this.setData({
    SelectedType:this.data.AllType[index2]
  });
},

MainIntroduction:function(e){
  this.setData({MainIntroduction:e.detail.value
  })
},

DetailIntroduction:function(e){
  this.setData({DetailIntroduction:e.detail.value
  })
},

InputPrice:function(e){
  this.setData({
   Price: Number(e.detail.value)
  })
},

CheckMainImage:function(e){  
  wx.showLoading({
  title: '上传商品中',
})
   if(this.data.MainImagePath.length === 0 ) {
    wx.hideLoading()
    wx.showToast({
      title: '请选择封面图片',
      icon: 'none'
    });
   }else{
   this.CheckMoreImage()
   }
},

CheckMoreImage:function(e){
  if(this.data.MoreImagePaths.length === 0 ) {
   wx.hideLoading()
   wx.showToast({
     title: '请选择详情图片',
     icon: 'none'
   });
  }else{
  this.CheckIP()
  }
},

CheckIP:function(e){
  if(this.data.SelectedIP === '无' ) {
   wx.hideLoading() 
   wx.showToast({
     title: '请选择IP',
     icon: 'none'
   });
  }else{
  this.CheckType()
  }
},

CheckType:function(){
  if(this.data.SelectedType === '无') {
    wx.hideLoading()
    wx.showToast({
      title: '请选择类型',
      icon: 'none'
    });
   }else{
   this.CheckMainIntroduction()
   }
},

CheckMainIntroduction:function(){
  if(this.data.MainIntroduction.length === 0 ) {
    wx.hideLoading()
    wx.showToast({
      title: '请输入封面介绍',
      icon: 'none'
    });
   }else{
   this.CheckDetailIntroduction()
   }
},

CheckDetailIntroduction:function(){
  if(this.data.DetailIntroduction.length === 0 ) {
    wx.hideLoading()
    wx.showToast({
      title: '请输入详细介绍',
      icon: 'none'
    });
   }else{
   this.CheckPrice()
   }
},

CheckPrice:function(){
  if(this.data.Price === null || typeof this.data.Price === 'string'  ) {
    wx.hideLoading()
    wx.showToast({
      title: '价格不能为空且必须是一个数字',
      icon: 'none'
    });
   }else{
   this.UploadMainImage()
   }
},

UploadMainImage:function(){
  let that = this;
  const cloudPath = 'MainGoodsImages/' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000) + that.data.MainImagePath.match(/\.[^.]+?$/)[0]+this.data.openid;
  wx.cloud.uploadFile({
    cloudPath:cloudPath, 
    filePath:this.data.MainImagePath, 
    success(res) {
      that.setData({MainImageFileID:res.fileID})
      console.log('上传封面成功', res.fileID);
      that.UploadMoreImage();
    },
    fail(err) {
      console.error('上传封面失败', err);
    }
  })
},

UploadMoreImage: function () {
  let MoreImagePaths = this.data.MoreImagePaths
  let fileIDs = []

  for (let i = 0; i < MoreImagePaths.length; i++) {
    let filePath = MoreImagePaths[i]
    // 使用wx.cloud.uploadFile方法上传图片
    wx.cloud.uploadFile({
      cloudPath: `MoreGoodsImages/${Date.now()}-${Math.random() * 1000000}.png`+this.data.openid, // 建议使用唯一的文件名
      filePath: filePath, // 本地文件路径
      success: res => {
        // 返回文件的fileID
        fileIDs.push(res.fileID)
        // 当所有图片都上传完毕后，你可以进行下一步操作
        if (fileIDs.length === MoreImagePaths.length) {
          console.log('所有图片上传完成', fileIDs)
          this.setData({MoreImageFileID:fileIDs})
          this.UploadGood()
        }
      },
      fail: err => {
        // 如果上传失败，可以在这里处理错误
        console.error('上传失败', err)
      }
    })
  }
 },

UploadGood:function(){
  wx.cloud.callFunction({
    name:'UploadNewGood',
    data:{
      openid: this.data.openid,
      MainImageFileID: this.data.MainImageFileID,
      MoreImageFileID: this.data.MoreImageFileID,
      SelectedIP: this.data.SelectedIP,
      SelectedType: this.data.SelectedType,
      MainIntroduction: this.data.MainIntroduction,
      DetailIntroduction: this.data.DetailIntroduction,
      Price: this.data.Price
    },
    success:function (res)  {
      wx.hideLoading()
      if (res.result.success) {
      wx.showToast({
        title: '上传成功',
        icon:'none'
      })
      wx.navigateBack()
      } else {
      wx.showToast({
        title: '上传失败',
        icon:'none'
      })
      console.log(res)
    }
  },
  fail:function (err)  {
    console.error('调用上传商品的云函数失败',err)
  }
  })
},

NavigateBack(){
  wx.navigateBack()
}
})