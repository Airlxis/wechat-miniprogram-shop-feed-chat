// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  await db.collection('Moments').where({_id:event.MomentID}).update({
    data:{
      State:'Deleted'
    }
  })

  await db.collection('User').where({openid:event.openid}).update({
    data:{
      Moments:db.command.pull(event.MomentID)
    }
  })
}