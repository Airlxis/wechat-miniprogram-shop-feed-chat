// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  try {
    // 使用db.command.push向数组字段添加元素
    const result1 = await db.collection('Moments').doc(event._id).update({
      data: {
        Like: db.command.push(event.openid)
      }
    })
    
    const result2 = await db.collection('User').where({
      openid: event.openid
    }).update({
      data: {
        Like: db.command.push({MomentID:event._id, LikeTimeID:event.TimeID})
      }
    })

    return {data:{result1,result2}};
  } catch (err) {
    console.error(err);
    return err;
  }
  
}