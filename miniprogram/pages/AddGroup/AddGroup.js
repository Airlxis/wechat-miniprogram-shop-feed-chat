// pages/AddGroup/AddGroup.js
Page({

  data: {
    A:[],
    B:[],
    C:[],
    D:[],
    E:[],
    F:[],
    G:[],
    H:[],
    I:[],
    J:[],
    K:[],
    L:[],
    M:[],
    N:[],
    O:[],
    P:[],
    Q:[],
    R:[],
    S:[],
    T:[],
    U:[],
    V:[],
    W:[],
    X:[],
    Y:[],
    Z:[],
  },

  onLoad(options) {
    wx.showLoading({
      title: '',
    })
    const that = this
    wx.cloud.callFunction({
      name:'GetAllIPs',
      success(res){
         console.log(res.result.data)
         that.setData({
          A:res.result.data.A,
          B:res.result.data.B,
          C:res.result.data.C,
          D:res.result.data.D,
          E:res.result.data.E,
          F:res.result.data.F,
          G:res.result.data.G,
          H:res.result.data.H,
          I:res.result.data.I,
          J:res.result.data.J,
          K:res.result.data.K,
          L:res.result.data.L,
          M:res.result.data.M,
          N:res.result.data.N,
          O:res.result.data.O,
          P:res.result.data.P,
          Q:res.result.data.Q,
          R:res.result.data.R,
          S:res.result.data.S,
          T:res.result.data.T,
          U:res.result.data.U,
          V:res.result.data.V,
          W:res.result.data.W,
          X:res.result.data.X,
          Y:res.result.data.Y,
          Z:res.result.data.Z,
         })
         wx.hideLoading()
      },
      fail(err){
          console.log('调用GetAllIPs失败',err)
          wx.hideLoading()
      }
    })
  },
  
  ApplyIP(){
    wx.showModal({
      title: '输入IP名称',
      editable: true, 
      success (res) {
        if (res.confirm) {
          console.log('用户输入的IP名称:', res.content);
          wx.cloud.callFunction({
            name:'ApplyNewIP',
            data:{
              ApplyIP:res.content
            },
            success(){
              wx.showModal({
                title: '提示',
                content: '已接受到申请，平台将会在一周内处理',
                complete: (res) => {
                  if (res.cancel) {
                  }
                  if (res.confirm) {
                  }
                }
              })
            },
            fail(err){
              console.error('调用云函数ApplyNewIP失败',err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击了取消');
        }
      }
    });
  },

  GoToDetail(e){
    console.log(e.currentTarget.dataset.item)
    const IP = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/IPdetail/IPdetail?_id=' + IP
    })
  },

  NavigateBack(){
    wx.navigateBack()
  },

})