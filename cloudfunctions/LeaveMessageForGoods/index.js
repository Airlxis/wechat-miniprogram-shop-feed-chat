// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  try{
    const result = await db.collection('goods').doc(event.GoodID).update({
      data: {
        Messages: _.push(event.Message)
      },
    })
    return { success: true, message: '留言成功', data: result }
  }
  catch(err){
    return { success: false, message: '留言失败', error:err }
  }
}