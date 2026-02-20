// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()


  const result = await db.collection('GroupChat').where({
    _id: event.GroupID
  }).field({Messages:true,GroupName:true})
  .get()

  console.log(result)

  const ChatHistory = result.data[0].Messages

  ChatHistory.sort((a, b) => b.id - a.id)

  let MessagesToAddno = []

  if(event.CurrentMessagesNumber === 0){
         MessagesToAddno = ChatHistory.slice(0, 50)
      }else{
         MessagesToAddno = ChatHistory.slice(event.CurrentMessagesNumber,event.CurrentMessagesNumber + 50)
      }

  const openids =  MessagesToAddno.map(function(item) {
      return item.openid;
     });

  const UI = await db.collection('User').where({openid:db.command.in(openids)}).field({
    nickName:true,
    avatarUrl:true,
    openid:true
  }).get()
  const userinfo = UI.data
  const defaultProfile = {
    nickName:'用户已注销',
    avatarUrl:'cloud://s-6gj66i67d89df4ed.732d-s-6gj66i67d89df4ed-1327638085/注销.jpg'
  }

  const MessagesToAdd = MessagesToAddno.map(item => {
    // 在 array2 中找到与当前 item.id 匹配的对象
    const itemFromArray2 = userinfo.find(subItem => subItem.openid === item.openid);
    
    // 如果找到匹配的对象，则合并它们
    if (itemFromArray2) {
      return { ...item, ...itemFromArray2 };
    }
    
    else// 如果没有找到匹配的对象，则只返回当前 item
    {
    return { ...item, ...defaultProfile };
  }
   });
 
   return {MessagesToAdd:MessagesToAdd,GroupName:result.data[0].GroupName}
}