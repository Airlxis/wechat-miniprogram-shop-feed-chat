// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()


  const query = await db.collection('IPs').doc(event.IP).field({ChatGroup:true}).get()

  const queryi = query.data.ChatGroup

  const index = queryi.findIndex(element => element.GroupID === event.GroupID)

  if (index !== -1) {
    queryi[index].Members.push(event.MyOpenid);
    }
  
  console.log(queryi)  

  await db.collection('IPs').doc(event.IP).update({
    data:{
      ChatGroup:queryi
    }
  })

  await db.collection('GroupChat').doc(event.GroupID).update({
    data:{
      Members:db.command.push(event.MyOpenid)
    }
  })

  await db.collection('User').where({openid:event.MyOpenid}).update({
    data:{
      ChatGroup:db.command.push({GroupID:event.GroupID,UnRead:0})
    }
  })
}