// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const timestamp = event.timestamp; // 假设这是你的时间戳
  const timestampString = timestamp.toString(); // 将时间戳转换为字符串
  const Digits = timestampString.slice(-9)
 
// 生成一个0到999之间的随机整数
const randomThreeDigits = Math.floor(Math.random() * 1000);
 
// 将随机数转换为字符串，并确保它是3位数（如果不足，前面补0）
const randomThreeDigitsStr = randomThreeDigits.toString().padStart(3, '0');
 
// 将随机数附加到时间戳的后8位数上
const GroupID = parseInt(Digits.toString() + randomThreeDigitsStr);



  await db.collection('IPs').where({_id: event.IP}).update({
        data:{
          ChatGroup:db.command.push({
            GroupID:GroupID,
            GroupName:event.GroupName,
            GroupAvatar:event.GroupAvatar,
            Creater:event.CreaterOpenid,
            Members:[event.CreaterOpenid]
          })
        }
      })

  await db.collection('GroupChat').add({
    data:{
      IP:event.IP,
      _id:GroupID,
      Creater:event.CreaterOpenid,
      Members:[event.CreaterOpenid],
      Messages:[],
      GroupName:event.GroupName,
      GroupAvatar:event.GroupAvatar
    }
  })

  await db.collection('User').where({openid:event.CreaterOpenid}).update({
    data:{ChatGroup:db.command.push({GroupID:GroupID,UnRead:0})
  }})
}