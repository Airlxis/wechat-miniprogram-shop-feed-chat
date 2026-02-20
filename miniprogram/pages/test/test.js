// pages/test/test.js
Page({

  data: {

  },

  onLoad(options) {
    this.Factorial()
  },
  
  Factorial(){
    for(var i = 10; i > 1;i--){
      let a = i*(i-1)
    }
    console.log(a)
  }

})