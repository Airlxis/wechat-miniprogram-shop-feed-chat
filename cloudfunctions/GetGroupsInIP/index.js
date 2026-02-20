// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const result = await db.collection('IPs').where({_id:event.IP}).field({ChatGroup:true}).get()
  console.log(result.data[0].ChatGroup)

  if (result.data[0].ChatGroup ) {
    
  const record = result.data[0].ChatGroup

  const ChatGroups = record.map(group =>{
    return{
      IsIn: group.Members.includes(event.MyOpenid),
      GroupName:group.GroupName,
      GroupAvatar:group.GroupAvatar,
      MemberNumber:group.Members.length,
      GroupID:group.GroupID
   }
  })
  
  return ChatGroups

}else{
  
  const ChatGroups = []

  return ChatGroups
}

}