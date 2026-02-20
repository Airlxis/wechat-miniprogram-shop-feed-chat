// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const  _ = db.command

  const result = await db.collection('PrivateChat') // 替换为你的集合名称
     .where({
       Chater: db.command.all([event.AnotherOpenid, event.MyOpenid]) // 这里是你想要筛选的元素
     })
     .get()

  const id = result.data[0].Message.length + 1   


  if (event.Type === 'text'){
  await db.collection('PrivateChat') // 替换为你的集合名称
  .where({
    Chater: db.command.all([event.AnotherOpenid, event.MyOpenid]) // 这里是你想要筛选的元素
  })
  .update({
     data:{
       Message: db.command.push({
        id:id,
        openid:event.MyOpenid,
        Time:event.Time,
        Content:event.Content,
        Type:event.Type,
        BubbleWidth:event.BubbleWidth
       })
     }
  })
}else{
  await db.collection('PrivateChat') // 替换为你的集合名称
  .where({
    Chater: db.command.all([event.AnotherOpenid, event.MyOpenid]) // 这里是你想要筛选的元素
  })
  .update({
     data:{
       Message: db.command.push({
        id:id,
        openid:event.MyOpenid,
        Time:event.Time,
        Content:event.Content,
        Type:event.Type,
       })
     }
  })
}

const asd = await db.collection('User').where({openid:event.AnotherOpenid}).field({Friends:true}).get()
const Friendss = asd.data[0].Friends


let Friends = Friendss.map(item => {
  if (item.FriendOpenid === event.MyOpenid) {
    // 修改属性b的值
    item.Unread += 1;
  }
  return item;
 });

await db.collection('User').where({
  openid: event.AnotherOpenid
 }).update({
  data: {
    'Friends':Friends
  }
 })

}