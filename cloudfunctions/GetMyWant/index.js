// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const MyWantGoodsid = await db.collection('User').where({
    openid:event.openid
  }).field({
    Want:true,
  }).get()

  const Goods_id = MyWantGoodsid.data[0].Want

  const MyWant = await db.collection('goods').where({
    _id : db.command.in(Goods_id)
  }).field({
    MainImageFileID:true,
    MainIntroduction:true,
    Price:true,
    Type:true,
    State:true
  }).get()
  
  return MyWant
}