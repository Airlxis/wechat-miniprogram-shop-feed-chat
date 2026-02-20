// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const queryFiendChatCollection = await db.collection('PrivateChat').where({
    Chater:db.command.all([event.Myopenid,event.OtherOpenid])
  }).get()

  if(queryFiendChatCollection.data.length !== 0){
    return 'Friend'
  }
  
  const queryUserApplication = await db.collection('User').where({
    openid:event.OtherOpenid
  }).field({FriendApplication:true}).get()

  const ISApplicated = queryUserApplication.data[0].FriendApplication.includes(event.Myopenid)

  if(ISApplicated){
    return 'Applicated'
  }else{
    return 'None'
  }

}