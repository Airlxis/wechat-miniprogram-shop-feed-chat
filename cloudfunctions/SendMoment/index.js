// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  try{
    const result = await db.collection('Moments').add({
       data:{
       openid:event.openid,
       Text:event.Text,
       ImageFileIDs:event.ImageFileIDs,
       State:'Showing',
       Tag:event.Tag,
       InSquare:event.InSquare,
       Time:event.time,
       TimeID:event.now,
       Comment:[],
       Like:[]
      }
     })

     await db.collection('User').where({openid:event.openid}).update({
      data: {
        Moments: db.command.push(result._id)
      }
    })


     return { success: true, message: '发说说成功',data:result }
  }
  catch(err){
    return { success: false, message: '发说说失败', error: err.message }
  }  

}