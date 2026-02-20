// pages/AccountNumberLogin/AccountNumberLogin.js
Page({

  data: {
    AccountNumber:'',
    password:'',
    isPasswordHidden:true,

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

  change:function(e){
    this.setData({
      isPasswordHidden: !this.data.isPasswordHidden
    });
  },
   
  Login:function(){
    wx.showLoading({
      title: '加载中',
    });
    const that = this
    wx.cloud.callFunction({
      name: 'AccountNumberLogin',
      data: {
        AccountNumber:  that.data.AccountNumber,
        password: that.data.password
      },
      success: res => {
        if (res.result.success) {
          console.log('登录成功', res.result.data)

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
        } else {
          console.error('登录失败', res.result.message)
          wx.showToast({
            title: '账号或密码错误',
            icon:'none'
          })
        }
        
      },
      fail: err => {
        console.error('云函数调用失败', err)
      }
     })
  },

To:function(){
  getApp().startwatching(this.data.openid)
  wx.redirectTo({
    url: '/pages/shopping/shopping',
  })
}

})