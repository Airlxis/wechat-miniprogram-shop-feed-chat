// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  var GroupID = parseInt(event.GroupID)
  const result = await db.collection('GroupChat') 
     .where({
      _id:GroupID
    })
     .get()
  console.log(result)

  const id = result.data[0].Messages.length + 1   

  if (event.Type === 'text'){
  await db.collection('GroupChat').doc(GroupID)
  .update({
     data:{
       Messages: db.command.push({
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
  await db.collection('GroupChat').doc(GroupID)
  .update({
     data:{
       Messages: db.command.push({
        id:id,
        openid:event.MyOpenid,
        Time:event.Time,
        Content:event.Content,
        Type:event.Type,
       })
     }
  })
}
  
const Members = result.data[0].Members
console.log('Members',Members)

for (const item of Members) {
  try {
    console.log('item',item)
    // 查询用户信息
    const asd = await db.collection('User').where({ openid: item }).field({ ChatGroup: true }).get();
    const ChatGroups = asd.data[0].ChatGroup;

            console.log('ChatGroups in',item,ChatGroups)

    // 更新未读消息数
    let ChatGroupss = ChatGroups.map(chatGroup => {
      if (chatGroup.GroupID === GroupID) {
        // 修改属性 Unread 的值
        chatGroup.UnRead += 1;
      }
      return chatGroup;
    });

             console.log('updated ChatGroupss in',item,ChatGroupss)

    // 更新用户信息
    await db.collection('User').where({
      openid: item
    }).update({
      data: {
        'ChatGroup': ChatGroupss
      }
    });

  } catch (err) {
    console.error('Error updating user:', item, err);
  }
}


}


