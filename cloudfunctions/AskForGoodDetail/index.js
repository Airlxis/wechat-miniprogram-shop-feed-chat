// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    const GoodDetail = await db.collection('goods').where({
      _id:event.id
    }).get()
    const GoodMasterOpenid = GoodDetail.data[0].openid
    const MasterProfile = await db.collection('User').where({
      openid:GoodMasterOpenid
    }).field({
      avatarUrl:true,
      nickName:true
    }).get()

    return { success: true, GoodDetail:GoodDetail.data[0], GoodMasterProfile:MasterProfile.data[0]}
  }catch (e) {
    console.error('Error occurred:', e)
    return {
      error: e.message
    }
  
}}