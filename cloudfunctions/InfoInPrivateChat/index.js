// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const anotherinfo = await db.collection('User').where({openid:event.AnotherOpenid}).field({
        avatarUrl:true,nickName:true
      }).get()
  
  console.log(anotherinfo)

  if (anotherinfo.data.length === 0) {
    return{nickName:'用户已注销',avatarUrl:'cloud://s-6gj66i67d89df4ed.732d-s-6gj66i67d89df4ed-1327638085/注销.jpg	'}
  }else{
    return{nickName:anotherinfo.data[0].nickName,avatarUrl:anotherinfo.data[0].avatarUrl}
  }
  
}