// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
try{ 
  const usersArray = await db.collection('User')
     .where({
       openid: _.in(event.openids)
     })
     .field({
       openid:true,
       nickName: true,
       avatarUrl: true
     }).get()
    console.log(usersArray)
    const messagesArray = event.Messages
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
  
   // 输出新的数组，它应该包含合并后的信息
   console.log('新数组',newMessagesArray);
   return { success: true,  data:newMessagesArray }
  }catch(err){
    console.error('Error occurred:', err)
    return {
      success: false, message: '获取昵称头像失败', error:err 
    }

  }

  }