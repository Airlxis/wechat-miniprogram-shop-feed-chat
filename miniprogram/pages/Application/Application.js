// pages/Application/Application.js
Page({

  data: {
    currentContentIndex: '0',

    InputAccountNumber:'',
    havesearched:null,

    OtherAccountNumber:'',
    currentContentIndex2:'0',
    ISFriend:'',
    Moments:[],
    Goods:[],
    avatarUrl:'',
    nickName:'',
    otheropenid:'',
    
    ApplicationList:[]
  },

  onLoad(options) {
    const that = this
    const app = getApp()
    wx.cloud.callFunction({
      name:'GetApplicationFromOther',
      data:{myopenid:app.globalData.openid},
      success:function(res){
        that.setData({ApplicationList:res.result})
        console.log('申请列表',that.data.ApplicationList)
      },
      fail:function(err){
        console.error('调用查看亲友申请的云函数失败',err)
      }
    })
  },

  changeContent: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentContentIndex: index
    });
   },

   changeContent2: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentContentIndex2: index
    });
   },

  input(e){
    this.setData({
      InputAccountNumber:e.detail.value
    })
  },
  
  SearchFriend:function(e){
    const that = this
    const app = getApp()
    const AccountNumberToSearch = that.data.InputAccountNumber
    wx.showLoading({
      title: '正在搜索',
    })
    wx.cloud.callFunction({
      name: 'SearchFriend',
      data:{
        AccountNumberToSearch:AccountNumberToSearch,
        myopenid:app.globalData.openid
      },
      success:function(res){
        if(res.result.success){
          console.log(res)
          const information = res.result.data.information
          that.setData({
            havesearched:true,
            OtherAccountNumber:information.AccountNumber,
            Moments:res.result.data.Moments,
            Goods:res.result.data.Goods,
            avatarUrl:information.avatarUrl,
            nickName:information.nickName,
            otheropenid:information.openid,
            ISFriend:res.result.data.state
          })
          wx.hideLoading()
        }else{
          wx.hideLoading()
          that.setData({
            havesearched:false
          })
          console.log(res.result.data)
          if(res.result.data === '不要搜自己'){
            wx.showToast({
              title: '不要搜自己',
              icon:'none'
            })
          }else{
            wx.showToast({
              title: '查无此人',
              icon:'none'
            })
          }
        }
      },
      fail:function(err){
        console.error('调用搜索亲友的云函数失败',err)
      }
    })
  
  },

  AddFriend(){
    const that = this
    const app = getApp()
    wx.cloud.callFunction({
      name:'AddFriend',
      data:{
        myopenid:app.globalData.openid,
        SearchedOpenid:that.data.otheropenid
      },
      success:function(res){
        that.setData({
          ISFriend:'Applicated'
        })
        wx.showToast({
          title: '已发送亲友申请,等待对方验证通过',
          icon:'none'
        })
      },
      fail:function(err){
        console.error('调用申请好友的云函数失败',err)
      }
    })
  },


  ToOther:function(e){
    const app = getApp()
    if(this.data.OtherOpenid === app.globalData.openid){
      console.log('这是自己的')
      return
    }else{
      wx.navigateTo({
        url: "/pages/other/other?OtherOpenid="+e.currentTarget.dataset.index
      })
    }
  },

  AgreeFriendApplication:function(e){
    wx.showLoading()
    const that = this
    const app = getApp()
    const otheropenid = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name:'AgreeFriendApplication',
      data:{
        Applicant:otheropenid,
        myopenid:app.globalData.openid
      },
      success:function(res){
        wx.showToast({
          title: '已同意申请',
          icon:'none'
        })
        const ApplicationArray = that.data.ApplicationList
        const index = ApplicationArray.findIndex(obj => obj.openid === otheropenid)
        console.log('aaaaaaaaaaaaaa',index)
        ApplicationArray.splice(index,1)
        that.setData({
          ApplicationList: ApplicationArray
        })
        wx.hideLoading()
      },
      fail:function(err){
        console.error('调用同意好友申请的云函数失败',err)
      }
    })
  },

  NavigateBack(){
    wx.navigateBack()
  },
})