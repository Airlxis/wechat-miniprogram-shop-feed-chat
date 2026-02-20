// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const MySellingGoodsid = await db.collection('User').where({
    openid:event.openid
  }).field({
    Goods:true,
  }).get()

  const Goods_id = MySellingGoodsid.data[0].Goods

  const MySelling = await db.collection('goods').where({
    _id : db.command.in(Goods_id)
  }).field({
    MainImageFileID:true,
    MainIntroduction:true,
    Price:true,
    Type:true
  }).get()
  
  return MySelling
}