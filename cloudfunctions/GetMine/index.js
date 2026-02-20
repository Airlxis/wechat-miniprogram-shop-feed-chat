// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const result = await db.collection('User').where({
    openid:event.openid
  }).field({
    avatarUrl:true,
    nickName:true,
    Goods:true,
    Moments:true,
    Want:true,
    Like:true,
    background:true,
    AccountNumber:true
  }).get()
  
  const avatarUrl = result.data[0].avatarUrl
  const nickName = result.data[0].nickName
  const Goods_id = result.data[0].Goods
  const Want_id = result.data[0].Want
  const Moments_id = result.data[0].Moments
  const Like_id = result.data[0].Like
  const AccountNumber = result.data[0].AccountNumber
  
  console.log('test',Like_id)

  const MyGoods = await db.collection('goods').where({
    _id : db.command.in(Goods_id)
  }).field({
    MainImageFileID:true,
    MainIntroduction:true,
    Price:true,
    Type:true
  }).get()

  const MyWant = await db.collection('goods').where({
    _id : db.command.in(Want_id)
  }).field({
    MainImageFileID:true,
    MainIntroduction:true,
    Price:true,
    Type:true
  }).get()


  return {
  avatarUrl:avatarUrl,
  nickName:nickName,
  AccountNumber:AccountNumber,
   MyGoods: MyGoods,
   MyWant:MyWant,
   Moments_id:Moments_id,
   Like_id :Like_id,
   background:result.data[0].background
 }
}