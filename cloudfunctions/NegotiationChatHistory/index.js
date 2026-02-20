// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const result = await db.collection('NegotiationChat') // 替换为你的集合名称
     .where({
       Bargainer: db.command.all([event.AnotherOpenid, event.MyOpenid]) // 这里是你想要筛选的元素
     })
     .get()
  

  console.log('test',event.CurrentMessagesNumber)

  console.log('yes',result.data[0].Message)

  const ChatHistory = result.data[0].Message

  ChatHistory.sort((a, b) => b.id - a.id)


  if(event.CurrentMessagesNumber === 0){
    let MessagesToAdd = ChatHistory.slice(0, 30)
    return  MessagesToAdd
  }else{
    let MessagesToAdd = ChatHistory.slice(event.CurrentMessagesNumber,event.CurrentMessagesNumber + 30)
console.log('MessagesToAdd',MessagesToAdd)
    return  MessagesToAdd
  }
  
  

}