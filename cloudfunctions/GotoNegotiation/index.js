// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  
  const query = {
    'Bargainer': {
      $all: [event.OtherOpenid, event.Myopenid] // 确保 a 数组中同时包含 b 和 c
    }
  };
  const result = await db.collection('NegotiationChat').where(query).get()
  console.log(result)

  if (result.data.length !== 0){
    return true
  }
  else{
    await db.collection('NegotiationChat').add({
      data:{
        Bargainer:[event.OtherOpenid,event.Myopenid],
        Message:[]
      }
    })
    await db.collection('User').where({openid:event.Myopenid}).update({
      data:{
        Bargainer:db.command.push({BargainerOpenid:event.OtherOpenid,Unread:0})
      }
    })
    await db.collection('User').where({openid:event.OtherOpenid}).update({
      data:{
        Bargainer:db.command.push({BargainerOpenid:event.Myopenid,Unread:0})
      }
    })

    return true
  }


}