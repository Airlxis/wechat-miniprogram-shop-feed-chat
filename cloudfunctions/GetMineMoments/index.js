// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  const resultA = await db.collection('User').where({openid:event.myopenid}).field({Moments:true}).get()
  const MomentsID = resultA.data[0].Moments

  const resultB = await db.collection('Moments').where({_id : _.in(MomentsID)}).orderBy('TimeID', 'desc').get()
  console.log(resultB)

  const MyMoments = resultB.data.map(item => {
    return {
      _id:item._id,
      Image:item.ImageFileIDs[0],
      LikeNumber:item.Like.length,
      CommentNumber:item.Comment.length,
      liked: item.Like.includes(event.myopenid),
      Tag:item.Tag
    }
  })

  return MyMoments
}