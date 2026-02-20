// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const  SelectedIPs  = event.SelectedIPs
  const  SelectedTypes  = event.SelectedTypes
 
 try {

   const query = await db.collection('goods').where({
    _id: _.not(_.in(event.hasgotten)),
    IP: _.in(SelectedIPs),
    Type:_.in(SelectedTypes),
    State:'Selling'
   }).field({
     IP:true,
     Type:true,
     _id:true,
     Price:true,
     MainIntroduction:true,
     MainImageFileID:true,
     State:true
   })
   .limit(20)
 
   const res = await query.get()
   const Random = res.data.map(obj => ({
    ...obj,
    randomValue: Math.random()
   }));
    
   // 根据随机属性对数组进行排序
   Random.sort((a, b) => a.randomValue - b.randomValue);

   console.log('Query result:', Random)
 
   // 返回筛选后的数据
   return Random
 } catch (e) {
   // 如果有错误，记录错误并返回
   console.error('Error occurred:', e)
   return {
     error: e.message
   }
 }



}
