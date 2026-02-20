// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  try{
     const result = await db.collection('Moments').doc(event._id).get()
     const SenderProfile = await db.collection('User')
     .where({
       openid: result.data.openid
     })
     .field({
       openid:true,
       nickName: true,
       avatarUrl: true
     }).get()
     

     const LikeNumber =  Array.isArray(result.data.Like) ? result.data.Like.length : 0
     const  CommentNumber =  Array.isArray(result.data.Comment) ? result.data.Comment.length : 0

  //getlike
     const queryResult = await db.collection('Moments')
     .where({
      _id: event._id,
    }).field({Like:true})
    .get()

   // 检查是否有记录满足条件
   let liked = queryResult.data[0].Like && queryResult.data[0].Like.includes(event.myopenid);


    
     const openids = [...new Set(result.data.Comment.map(item => item.openid))];

     
     const usersArray = await db.collection('User')
     .where({
       openid: _.in(openids)
     })
     .field({
       openid:true,
       nickName: true,
       avatarUrl: true
     }).get()
    console.log(usersArray)
    const messagesArray = result.data.Comment
    const defaultUserInfo = {
      avatarUrl: 'cloud://s-6gj66i67d89df4ed.732d-s-6gj66i67d89df4ed-1327638085/注销.jpg',
      nickName: '用户已注销'
     };
   // 创建一个以openid为键的对象
     const usersMap = usersArray.data.reduce((map, user) => {
    map[user.openid] = { avatarUrl: user.avatarUrl, nickName: user.nickName };
    return map;
   }, {});
  
   // 创建新的数组，包含消息和对应的用户信息
   const newMessagesArray = messagesArray.map(message => {
    // 使用openid找到对应的用户信息
    const userInfo = usersMap[message.openid];
    // 如果找到用户信息，则添加到消息对象中
    console.log(userInfo)
    if (userInfo) {
      return { ...message, ...userInfo };
    } else {
      // 如果没有找到用户信息，可以选择只返回消息对象或者添加一些默认值
      return { ...message, ...defaultUserInfo };
    }
   });
     
    delete result.data.Comment

     return { success: true, message: '获取广场说说成功',data: {
       result,
       LikeNumber,
       CommentNumber,
       liked,
       SenderProfile,
       newMessagesArray
      }}
  }
  catch(err){
    return { success: false, message: '获取广场说说失败', error: err.message }
  }  
}