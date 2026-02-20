// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('wxContext',wxContext)
  const openid = wxContext.OPENID
  const db = cloud.database()
  
  const queryResult = await db.collection('User').where({
      openid: openid
    }).get()
    if (queryResult.data.length > 0) {
      console.log(queryResult)
      return {
        success:true,
        data:queryResult.data[0]
      }

    } else {
      return {
        success: false,
        message: '用户未注册'
      }
    }
}