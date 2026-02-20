// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  const result =  await db.collection('User').where({AccountNumber:event.AccountNumberToSearch}).field({
    AccountNumber:true,
    nickName:true,
    avatarUrl:true,
    openid:true,
    Goods:true,
    Moments:true,
    Friends:true,
    FriendApplication:true
  }).get()
  

 
  if(result.data.length>0) {
   
    if(result.data[0].openid === event.myopenid){
      return {success:false, data:'不要搜自己'}
    }

  
    const Goodss = await db.collection('goods').where({
      _id : db.command.in(result.data[0].Goods)
    }).field({
      MainImageFileID:true,
      MainIntroduction:true,
      Price:true,
      Type:true
    }).get()
    const Goods = Goodss.data

    const Momentss = await db.collection('Moments').where({
      _id : db.command.in(result.data[0].Moments)
    })
    .orderBy('TimeID', 'desc')
    .field({
      ImageFileIDs:true,
      Like:true
    }).get()
    const Moments = Momentss.data.map(record => {
      return {
        _id: record._id, // 记录ID
        LikeNumber: Array.isArray(record.Like) ? record.Like.length : 0,
        CommentNumber: Array.isArray(record.Comment) ? record.Comment.length : 0,
        openid: record.openid,
        Text:record.Text,
        ImageFileIDs: record.ImageFileIDs[0],
        InSquare:record.InSquare,
        Time:record.Time,
       // Comment:record.Comment,
        TimeID:record.TimeID
      }
    });

  const IsFriend = result.data[0].Friends && result.data[0].Friends.some(obj => obj.FriendOpenid === event.myopenid)

  if(IsFriend){
    return {success: true ,  data:{ information:result.data[0], state:'Friend',Goods,Moments}}
  }

  const ISApplicated = result.data[0].FriendApplication.includes(event.myopenid)

  if(ISApplicated){
    return {success: true ,  data:{ information:result.data[0], state:'Applicated',Goods,Moments}}
  }else{
    return {success: true ,  data:{ information:result.data[0], state:'None',Goods,Moments}}
  }


}else{
return {success:false, data:'查无此人'}
}
}

