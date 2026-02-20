// pages/shopping/shopping.js
Page({

  data: {
    avatar:'',
    
    Inputcontent:'',
    AllType:[
      { id: 1, name: '谷子' ,icon:'/images/谷子.png',checked:false},
      { id: 2, name: '手办' ,icon:'/images/手办.png',checked:false},
      { id: 3, name: '玩偶' ,icon:'/images/玩偶.png',checked:false},
      { id: 4, name: '漫画' ,icon:'/images/漫画.png',checked:false},
      { id: 5, name: '衣包',icon:'/images/衣包.png',checked:false },
      { id: 6, name: '小说',icon:'/images/小说.png',checked:false },
      { id: 7, name: 'cos' ,icon:'/images/cos.png',checked:false},
      { id: 8, name: '更多' ,icon:'/images/更多.png',checked:false},
     ],
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
    WORD:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],  
    AllIPWithoutClassified:[],
    SelectedTypes:[],
    SelectedIPs:[],
    FilteredGoods:[],
    FilteredInput:[],
    unfold:false,
    hasMoreData: true, // 是否还有更多数据

    Day:true,
    scrollTop:0,
    GlobalUnread:0
    },
  
  onLoad(options) {
    if(getApp().globalData.SavedShopping.A){

     this.setData(getApp().globalData.SavedShopping)
    
    }else{
    var that = this;
    that.setData({
      avatar:getApp().globalData.avatarUrl,
    })
    wx.showLoading({
      title: '加载IP筛选框',
    });
    wx.cloud.callFunction({
      name:'GetAllIPs',
      success:function(res){
        const ClassifiedIPs = res.result.data

        // 使用 reduce 方法将所有数组的元素提取出来，合并为一个新的大数组
        let AllIPWithoutClassified = Object.values(ClassifiedIPs).reduce((accumulator, currentArray) => {
         // 使用展开运算符（...）将当前数组中的元素展开并添加到累加器数组中
        return [...accumulator, ...currentArray];
       }, []);


        for (let Key in ClassifiedIPs){
          ClassifiedIPs[Key] = ClassifiedIPs[Key].map(function(element){
            return{_id:element,checked:false }
          })
        }

        that.setData({
          A:ClassifiedIPs.A,
          B:ClassifiedIPs.B,
          C:ClassifiedIPs.C,
          D:ClassifiedIPs.D,
          E:ClassifiedIPs.E,
          F:ClassifiedIPs.F,
          G:ClassifiedIPs.G,
          H:ClassifiedIPs.H,
          I:ClassifiedIPs.I,
          J:ClassifiedIPs.J,
          K:ClassifiedIPs.K,
          L:ClassifiedIPs.L,
          M:ClassifiedIPs.M,
          N:ClassifiedIPs.N,
          O:ClassifiedIPs.O,
          P:ClassifiedIPs.P,
          Q:ClassifiedIPs.Q,
          R:ClassifiedIPs.R,
          S:ClassifiedIPs.S,
          T:ClassifiedIPs.T,
          U:ClassifiedIPs.U,
          V:ClassifiedIPs.V,
          W:ClassifiedIPs.W,
          X:ClassifiedIPs.X,
          Y:ClassifiedIPs.Y,
          Z:ClassifiedIPs.Z,
          AllIPWithoutClassified:AllIPWithoutClassified,
          SelectedIPs:AllIPWithoutClassified,
          SelectedTypes:that.data.AllType.map(item => item.name)
        })
          wx.hideLoading()
          that.SendSelectedToCloudFunction()
      },
      fail:function(error){
        console.error('调用云函数获取所有IP失败：', err);
      }
    })
    
  }
   },
    
  onShow(){
    const that = this 
    wx.pageScrollTo({
      scrollTop:that.data.scrollTop,
      duration:100
    })

    that.setData({
      Day: getApp().globalData.Day,
      GlobalUnread:  getApp().globalData.Unreads
    })
  },

  onUnload(){


  },

  onReachBottom: function () {
     if (this.data.hasMoreData ) {
    this.SendSelectedToCloudFunction();
    console.log('下拉刷新')
  }
  },

  onPullDownRefresh(){
  this.setData({
    FilteredGoods:[],
    FilteredInput:[],
    scrollTop:0
  })
  this.SendSelectedToCloudFunction()
  },

  onSearchInput:function(e){
    this.setData({Inputcontent:e.detail.value})
  },

  onsearch:function(e){
    const c = this.data.Inputcontent
    const FilteredInput = this.data.FilteredGoods.filter(item => {
      return item.MainIntroduction.includes(c);	});
    this.setData({
      FilteredInput: FilteredInput
     })
    console.log(this.data.FilteredInput)
  },

  SelectType:function(e){
    const checkedValues = e.detail.value;
    const newAllType = this.data.AllType.map(item => {
      item.checked = checkedValues.includes(item.name);
      return item;
    });
    this.setData({
      FilteredGoods:[],
      AllType: newAllType
    });

if(this.data.AllType.filter(item => item.checked).length !== 0){
    this.setData({
      SelectedTypes:this.data.AllType.filter(item => item.checked).map(item => item.name)
    });
  }else{
    this.setData({
      SelectedTypes:this.data.AllType.map(item => item.name)
    })
  } 

    console.log('选中的类型:', this.data.SelectedTypes);
    this.SendSelectedToCloudFunction();
  },

  SelectIP:function(e){
    console.log(e.detail.value)
    const checkedIPs=e.detail.value
    this.setData({
      FilteredGoods:[],
      A:this.data.A.map(item=>({
        ...item,
        checked:checkedIPs.includes(item._id) 
      })),
      B:this.data.B.map(item=>({
        ...item,
        checked:checkedIPs.includes(item._id) 
      })),C: this.data.C.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      D: this.data.D.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      E: this.data.E.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      F: this.data.F.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      G: this.data.G.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      H: this.data.H.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      I: this.data.I.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      J: this.data.J.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      K: this.data.K.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      L: this.data.L.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      M: this.data.M.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      N: this.data.N.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      O: this.data.O.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      P: this.data.P.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      Q: this.data.Q.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      R: this.data.R.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      S: this.data.S.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      T: this.data.T.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      U: this.data.U.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      V: this.data.V.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      W: this.data.W.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      X: this.data.X.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      Y: this.data.Y.map(item => ({ ...item, checked: checkedIPs.includes(item._id) })),
      Z: this.data.Z.map(item => ({ ...item, checked: checkedIPs.includes(item._id) }))
    });

    if(checkedIPs.length === 0){
      this.setData({SelectedIPs:this.data.AllIPWithoutClassified})
    }else{
      this.setData({SelectedIPs :checkedIPs})
    }

    this.SendSelectedToCloudFunction();
  },
  
  SendSelectedToCloudFunction(){
    wx.showLoading({
      title: '加载过滤器',
    })
    const that = this
    const hasgotten = that.data.FilteredGoods.map(item => item._id);
    wx.cloud.callFunction({
      name:'Filter',
      data:{
        SelectedIPs :that.data.SelectedIPs,
        SelectedTypes:that.data.SelectedTypes,
        hasgotten:hasgotten
      },
      success: res => {
      console.log('云函数调用成功，返回结果：',res)


      const FilteredGoods =  that.data.FilteredGoods.concat(res.result)

        that.setData({
      FilteredGoods:FilteredGoods,
      FilteredInput:[],
        })
        wx.hideLoading()
        if (res.result.length < 20) {
          // 如果新加载的数据少于 pageSize，说明没有更多数据
          that.setData({ hasMoreData: false });
        }
      },
      fail: err => {
        // 云函数调用失败
        console.error('云函数调用失败'.err);
       

      }
    });
  },
  
  Fold:function(e){
    this.setData({unfold:false})
  },

  UnFold:function(e){
    this.setData({unfold:true})
  },

  ToAddGoods:function(e){
   wx.navigateTo({
     url: '/pages/AddGoods/AddGoods',
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

  goToGoodDetail:function(event){
    console.log(event)
   const productId = event.currentTarget.dataset.id;
   console.log(productId)
   wx.navigateTo({
    url: '/pages/GoodDetail/GoodDetail?id=' + productId
  });
},

  ToSquare:function(){
    const that = this
  
    const query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      console.log('res',res)
      // res[0] 包含滚动视图的滚动位置信息
      const scrollTop = res[0].scrollTop;

      // 将滚动位置保存到全局变量或者本地存储
      that.setData({scrollTop:scrollTop})
      
      getApp().globalData.SavedShopping = that.data

      wx.redirectTo({
        url: '/pages/square/square',
      })
    });

},

ToMessage:function(){
  const that = this
  
    const query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      console.log('res',res)
      // res[0] 包含滚动视图的滚动位置信息
      const scrollTop = res[0].scrollTop;

      // 将滚动位置保存到全局变量或者本地存储
      that.setData({scrollTop:scrollTop})
      
      getApp().globalData.SavedShopping = that.data


    wx.redirectTo({
      url: '/pages/messages/message',
    })
  });

},

ToMine:function(){
  const that = this
  
  const query = wx.createSelectorQuery();
  query.selectViewport().scrollOffset()
  query.exec((res) => {
    // res[0] 包含滚动视图的滚动位置信息
    const scrollTop = res[0].scrollTop;
    console.log(scrollTop,'dawd')
    // 将滚动位置保存到全局变量或者本地存储
    that.setData({scrollTop:scrollTop})
    
    getApp().globalData.SavedShopping = that.data
  });
  wx.redirectTo({
    url: '/pages/mine/mine',
  })
},
})