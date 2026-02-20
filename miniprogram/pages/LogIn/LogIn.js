// pages/LogIn/LogIn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   openid:''
  },

onLoad(){
  var a = 1
  for(var i = 10; i>1; i-- ){
    a = a*i
  }
  console.log(a)

  const array = [3,8,6,8,4,1,1,5,8,0,4,6,3,2,6,1,0,1,4,7,3,2,7,9,4,2,6,9,4,2,5,8,0,3]
  var b = array[1]
  array.map(item => {
    if(item > b){
      b = item
    }
  })
  console.log(b)
},

WxLogin:function(){
  wx.showLoading({
    title: '加载中',
  });
  const that = this
  wx.cloud.callFunction({
    name: 'Register',
    success: res => {
      console.log(res.result) 
      if(res.result.success){

        const app = getApp();
        const appdata = app.globalData
        const record =  res.result.data

        appdata.openid = record.openid
        appdata.AccountNumber = record.AccountNumber
        appdata.nickName = record.nickName;
        appdata.avatarUrl = record.avatarUrl;
        appdata.gender = record.gender;
        appdata.GroupUnread = record.ChatGroup.map(item => item.UnRead)
        appdata.FriendUnread = record.Friends.map(item => item.Unread)
        appdata.BargainerUnread = record.Bargainer.map(item => item.Unread)
        appdata.GroupUnreads = record.ChatGroup.map(item => item.UnRead).reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
         }, 0);
         let FriendUnreads = record.Friends.map(item => item.Unread).reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
         }, 0);
         let BargainerUnreads = record.Bargainer.map(item => item.Unread).reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
         }, 0);
         let PrivateUnreads = FriendUnreads + BargainerUnreads 
         appdata.PrivateUnreads = PrivateUnreads
         appdata.Unreads = PrivateUnreads + record.ChatGroup.map(item => item.UnRead).reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
         }, 0);
        that.To()
      }else{
        wx.showToast({
          title: '您未注册',
          icon:'none'
        })
      }
    },
    fail: err => {
      console.error('调用云函数失败', err)
    }
   })

  },

To:function(){

  getApp().startwatching()
  wx.redirectTo({
    url: '/pages/shopping/shopping',
  })
},

AccountNumberLogin:function(){
  wx.navigateTo({
    url: '/pages/AccountNumberLogin/AccountNumberLogin' 
  })
},
  
toRegister:function(){
  wx.navigateTo({
    url: '/pages/Register/Register'
  })
},
})