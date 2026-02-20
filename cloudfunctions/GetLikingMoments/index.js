// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
 
  const resultA = await db.collection('User').where({openid:event.myopenid}).field({Like:true}).get()
  const MomentsID = resultA.data[0].Like.map(item => {
    return item.MomentID
  })

  const resultB = await db.collection('Moments').where({_id : _.in(MomentsID)}).get()
  console.log(resultB)

  const LikingMomentsWithOutSorted = resultB.data.map(item => {
    return {
      _id:item._id,
      Image:item.ImageFileIDs[0],
      LikeNumber:item.Like.length,
      CommentNumber:item.Comment.length,
      liked: item.Like.includes(event.myopenid),
      Tag:item.Tag
    }
  })

  const LikingArray = resultA.data[0].Like

  let LikingMoments = []

  LikingMomentsWithOutSorted.map(item =>{
    let matchedElement = LikingArray.find(item2 => item2.MomentID === item._id)
    LikingMoments.push({...item,...matchedElement})
  })

  LikingMoments.sort((a,b) => {
    return b.LikeTimeID - a.LikeTimeID
  })

  return LikingMoments

}