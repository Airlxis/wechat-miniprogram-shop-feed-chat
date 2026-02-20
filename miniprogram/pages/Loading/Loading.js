// pages/Loading/Loading.js
Page({

  data: {

  },

  onLoad(options) {
    wx.cloud.callFunction({
      name:'aTrialFunction',

    })

  },

  end:function(e){
    wx.redirectTo({
      url: '/pages/LogIn/LogIn',
    })
  }
})