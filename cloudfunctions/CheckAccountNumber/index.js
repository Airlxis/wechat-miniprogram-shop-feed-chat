// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const queryResult = await db.collection('User').where({
      AccountNumber:event.AccountNumber
    }).get()
    if (queryResult.data.length > 0) {
      return {
        success: true,
        message: '该账号已被人使用'
      }
    } else {
      return {
        success: false,
        message: '该账号未被人使用'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: '账号查询失败',
      error: error
    }
  }
}