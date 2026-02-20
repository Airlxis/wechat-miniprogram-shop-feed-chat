// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  console.log(event)

  await db.collection('User').where({openid:event.myopenid}).update({
    data:{
    Friends:db.command.push({FriendOpenid:event.Applicant,Unread:0}),
    FriendApplication:db.command.pull(event.Applicant)
    }
  })


    
  await db.collection('User').where({openid:event.Applicant}).update({
    data:{
     Friends:db.command.push({FriendOpenid:event.myopenid,Unread:0}),
    FriendApplication:db.command.pull(event.myopenid)
    }
    })
  
  await db.collection('PrivateChat').add({
    data:{
      Chater:[event.myopenid,event.Applicant],
      Message:[]
    }
  })  
}