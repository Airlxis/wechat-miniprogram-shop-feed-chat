// pages/Register/Register.js
Page({

  data: {
  hasAgreed: false ,
  openid:'',
  nickName:'',
  avatarUrl:'',
  gender:'',
  code:'',
  AccountNumber:'',
  password:'',
  password2:'',
  isPasswordMatch: false,
  isPasswordHidden1: true,
  isPasswordHidden2: true,
  },

  inputAccount:function(e){
    this.setData({
      AccountNumber:e.detail.value
    })
  },

  inputPassword:function(e){
    this.setData({
      password:e.detail.value
    })
  },

  inputPassword2:function(e){
    this.setData({
      password2:e.detail.value
    })
  },
  
  change1:function(e){
    this.setData({
      isPasswordHidden1: !this.data.isPasswordHidden1
    });
  },
  change2:function(e){
    this.setData({
      isPasswordHidden2: !this.data.isPasswordHidden2
    });
  },

onGetUserProfile: function(e) {
  wx.showLoading({
    title: '正在注册',
  })
  if (e.detail.userInfo) {
    const userInfo = e.detail.userInfo;
    console.log(userInfo);
    this.setData({
      nickName:userInfo.nickName,
      avatarUrl:userInfo.avatarUrl,
      gender:userInfo.gender
    })
    console.log(this.data.nickName,this.data.avatarUrl,this.data.gender)
    this.GetOpenID();
  } else {
    wx.hideLoading()
    console.log('用户拒绝授权');
  }
},

GetOpenID:function(){
  wx.cloud.callFunction({
    name: 'GetOpenID',
    success: res => {
      console.log('获取openid成功',res.result) 
      this.setData({openid:res.result})
      this.UserCheck()
    },
    fail: err => {
      wx.hideLoading()
      console.error('获取openid失败', err)
    }
   })
},

UserCheck:function(){
  const that = this
  wx.cloud.callFunction({
    name:'UserCheck',
    data:{
      openid:this.data.openid
    },
    success:function (res) {
      if (res.result.success) {
        wx.hideLoading()
        wx.showToast({
          title: '该微信号已注册用户',
          icon:'none'
        })
      } else {
        that.CheckAccountNumberExited()
      }
    },
    fail:function (err) {
    wx.hideLoading()
    console.error('调用云函数检查账户是否存在失败', err)
    },
  })

},

CheckAccountNumberExited:function(){
  const that = this
  if(!this.data.AccountNumber){
    wx.hideLoading()
    wx.showToast({
      title: '账号不能为空',
      icon:'none'
    })
  }else{
    that.CheckAccountNumberSuitable()
  }
},

CheckAccountNumberSuitable(){
  const regex = /^[A-Za-z0-9]+$/;
  const that = this
  if(regex.test(this.data.AccountNumber)){
    that.CheckAccountNumberIfUsed()
  }else{
    wx.hideLoading()
    wx.showToast({
      title: '账号不能包含特殊字符',
      icon:'none'
    })
  }
},

CheckAccountNumberIfUsed:function(){
  const that = this
  wx.cloud.callFunction({
    name:'CheckAccountNumber',
    data:{AccountNumber:this.data.AccountNumber},
    success:function (res)  {
      if (res.result.success) {
        wx.hideLoading()
        wx.showToast({
          title: '该账号已被人使用',
          icon:'none'
        })
      } else {
        that.CheckPassword()
      }
     
    },
    fail:function (err)  {
      console.error('调用云函数检查用户名是否存在失败',err)
    },
  })
},

CheckPassword:function(){
  if (this.data.password === this.data.password2 && this.data.password !== '') {
    this.setData({
      isPasswordMatch: true
    });
    this.CheckAgrement()
  } else {
    this.setData({
      isPasswordMatch: false});
      wx.hideLoading()
    wx.showToast({
      title: '密码为空或两次输入的密码不一致',
      icon:'none' })
  }
},

CheckAgrement:function(){
  if (this.data.hasAgreed) {
    this.Register()
  } 
  else {
    wx.hideLoading()
    wx.showToast({
      title: '请先阅读并同意谷饲社区用户公约',
      icon:'none',
    
    })
    console.log(this.data.hasAgreed)
  }
},

Register:function(){
  wx.cloud.callFunction({
   name:'UploadNewUser',
   data:{
     openid:this.data.openid,
     AccountNumber:this.data.AccountNumber,
     password:this.data.password,
     nickName:this.data.nickName,
     avatarUrl:this.data.avatarUrl,
     gender:this.data.gender,
   },
   success:function (res)  {
    if (res.result.success) {
    wx.showToast({
      title: '注册成功',
      icon:'none'
    })
    wx.navigateBack()
    } else {
    wx.hideLoading()
    wx.showToast({
      title: '注册失败',
      icon:'none'
    })
    }
   
  },
  fail:function (err)  {
    wx.hideLoading()
    console.error('调用云函数注册失败',err)
  }
  })
  
},

onAgreeChange: function(e) {
  this.setData({
    hasAgreed: !this.data.hasAgreed })
  },

SeeAgrement:function(){
    wx.navigateTo({
      url: '/pages/Agrement/Agrement'
    })
  },

Toprotocol(){
    wx.navigateTo({
      url: '/pages/protocol/protocol',
    })
  }
})

