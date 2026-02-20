// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  await db.collection('goods').where({_id:event.GoodID}).update({
    data:{
      State:'Deleted'
    }
  })

  await db.collection('User').where({openid:event.openid}).update({
    data:{
      Goods:db.command.pull(event.GoodID)
    }
  })
}