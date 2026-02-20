// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  console.log(event)
  const Comment = {
    time:event.time,
    openid:event.openid,
    content:event.content,
    timeid:event.now
  }
  try {
    // 使用db.command.push向数组字段添加元素
    const result = await db.collection('Moments').doc(event._id).update({
      data: {
        Comment: db.command.push(Comment)
      }
    });
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }

}