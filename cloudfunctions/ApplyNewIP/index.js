// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  await db.collection('ApplyingIP').doc('0ecc3a0a677c198d044b38465384d3ab').update({
    data:{
      ApplyingIP:db.command.push(event.ApplyIP)
    }
  })
}