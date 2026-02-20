// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  console.log('test',event.pages)

  if(event.Tag){
      What = await db.collection('Moments').where({State:'Showing',Tag:event.Tag}).orderBy('TimeID', 'desc') // 按照TimeID从大到小排序
     .skip(event.pages*30).limit(30).get()
    }else{
      What = await db.collection('Moments').where({State:'Showing'}).orderBy('TimeID', 'desc') 
     // 按照TimeID从大到小排序
     .skip(event.pages*30).limit(30).get()
    }

     const result = What.data.map(record => {
      return {
        _id: record._id, // 记录ID
        LikeNumber: Array.isArray(record.Like) ? record.Like.length : 0,
        liked: record.Like.includes(event.myopenid),
        CommentNumber: Array.isArray(record.Comment) ? record.Comment.length : 0,
        openid: record.openid,
        Text:record.Text,
        ImageFileIDs: record.ImageFileIDs,
        Tag:record.Tag,
        InSquare:record.InSquare,
        Time:record.Time,
        TimeID:record.TimeID
      }
    });

    let momentsArray = result;
  

   //getsenderprofile
    const openids = [...new Set(momentsArray.map(item => item.openid))];
    const usersArray = await db.collection('User')
     .where({
       openid: _.in(openids)
     })
     .field({
       openid:true,
       nickName: true,
       avatarUrl: true
     }).get()

    const defaultUserInfo = {
      avatarUrl: 'cloud://s-6gj66i67d89df4ed.732d-s-6gj66i67d89df4ed-1327638085/注销.jpg',
      nickName: '用户已注销'
     };
   // 创建一个以openid为键的对象
     const usersMap = usersArray.data.reduce((map, user) => {
    map[user.openid] = { avatarUrl: user.avatarUrl, nickName: user.nickName };
    return map;
   }, {});
  const messagesArray = momentsArray
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
  


   

     return { success: true, message: '获取广场说说成功',data:newMessagesArray }

}