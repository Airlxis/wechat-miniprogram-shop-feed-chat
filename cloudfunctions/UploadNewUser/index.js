// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const dataToAdd = {
    openid: event.openid,
    AccountNumber: event.AccountNumber ,
    password:event.password,
    nickName:event.nickName,
    avatarUrl:event.avatarUrl,
    gender:event.gender,
    Friends:[],
    FriendApplication:[],
    ChatGroup:[],
    Want:[],
    Moments:[],
    Like:[],
    Goods:[],
    background:'',
    Bargainer:[]
  }
  try {
  const result = await db.collection('User').add({
    data: dataToAdd
  })
  return { success: true, message: '用户注册成功', data: result }
} 
  catch (err) {
    return { success: false, message: '用户注册失败', error: err.message }
}
}