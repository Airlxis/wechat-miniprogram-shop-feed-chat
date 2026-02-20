// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
 
  const asd = await db.collection('User').where({openid:event.MyOpenid}).field({Bargainer:true}).get()
const Bargainerss = asd.data[0].Bargainer


let Bargainers = Bargainerss.map(item => {
  if (item.BargainerOpenid === event.AnotherOpenid) {
    // 修改属性b的值
    item.Unread = 0;
  }
  return item;
 });

await db.collection('User').where({
  openid: event.MyOpenid
 }).update({
  data: {
    'Bargainer':Bargainers
  }
 })
}