// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  var GroupID = parseInt(event.GroupID)

  try {
    // 查询用户信息
    const asd = await db.collection('User').where({ openid: event.MyOpenid }).field({ ChatGroup: true }).get();
    const ChatGroups = asd.data[0].ChatGroup;

    // 更新未读消息数
    let ChatGroupss = ChatGroups.map(chatGroup => {
      if (chatGroup.GroupID === GroupID) {
        // 修改属性 Unread 的值
        chatGroup.UnRead = 0;
      }
      return chatGroup;
    });

    // 更新用户信息
    await db.collection('User').where({
      openid: event.MyOpenid
    }).update({
      data: {
        'ChatGroup': ChatGroupss
      }
    });

  } catch (err) {
    console.error('Error updating user:', item, err);
  }
}
