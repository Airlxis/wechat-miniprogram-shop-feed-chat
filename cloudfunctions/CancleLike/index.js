// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

    // 使用db.command.push向数组字段添加元素
    await db.collection('Moments').doc(event._id).update({
      data: {
        Like: db.command.pull(event.openid)
      }
    })

    await db.collection('User').where({
      openid: event.openid
    }).update({
      data: {
        Like: db.command.pull({
          MomentID:event._id
        })
      }
    })

}