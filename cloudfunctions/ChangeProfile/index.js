// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const  db = cloud.database()

  if(event.part === 'nickName'){
 await db.collection('User').where({openid:event.openid}).update({
    data:{
    nickName:event.value
    }
  })
}

  if(event.part === 'avatarUrl'){
    await db.collection('User').where({openid:event.openid}).update({
       data:{
        avatarUrl:event.value
       }
     })
    }

    if(event.part === 'background'){
      await db.collection('User').where({openid:event.openid}).update({
         data:{
          background:event.value
         }
       })
      }
 }