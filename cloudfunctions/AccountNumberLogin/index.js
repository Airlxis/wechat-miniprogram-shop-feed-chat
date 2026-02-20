// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const  db = cloud.database()
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  console.log(openid)
  try {
    const user = await db.collection('User').where({
      AccountNumber: event.AccountNumber,
      password: event.password
    }).get()
  
    if (user.data.length > 0) {
      return { success: true, data: user.data[0] }
    } else {

      return { success: false, message: '账号或密码错误' }
    }
  } catch (err) {

    return { success: false, message: '登录失败', error: err.message }
  }
 }