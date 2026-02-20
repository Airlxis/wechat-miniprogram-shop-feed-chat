// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const a = [event.SelectedIP]
  const b = [event.SelectedType]
  const dataToAdd = {
    openid: event.openid, 
    MainImageFileID: event.MainImageFileID,
    MoreImageFileID: event.MoreImageFileID,
    IP: event.SelectedIP,
    Type: event.SelectedType,
    MainIntroduction: event.MainIntroduction,
    DetailIntroduction: event.DetailIntroduction,
    Price: event.Price,
    Messages:[],
    State:'Selling',
    WhoWant:[]
  }
  try {
    const result = await db.collection('goods').add({
      data: dataToAdd
    })

    const User_id = await db.collection('User').where({
      openid:event.openid
    }).field({
      _id:true
    }).get()

     await db.collection('User').doc(User_id.data[0]._id).update({
      data: {
        Goods: db.command.push(result._id)
      }
    })
    return { success: true, message: '上传商品成功', data: result }
  } 
    catch (err) {
      return { success: false, message: '上传商品失败', error: err.message }
  }
}