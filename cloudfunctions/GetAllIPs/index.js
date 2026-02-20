// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const _ = db.command
  try {
    const AllIPs  =  await db.collection('IPs').doc('分类汇总').
    get()
  
    delete AllIPs.data._id

    return {
      success: true,
      message: '获取所有IP成功',
      data: AllIPs.data
      }
    
  } catch (error) {
    return {
      success: false,
      message: '获取所有IP失败',
      error: error
    }
  }

}