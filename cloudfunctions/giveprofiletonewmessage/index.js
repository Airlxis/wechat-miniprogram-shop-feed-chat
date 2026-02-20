// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const result = await db.collection('User').where({openid:event.newmessage.openid}).field({nickName:true,avatarUrl:true}).get()

  if(result.data.length !== 0){
    const profile = result.data[0]
    const Withprofile = Object.assign(event.newmessage, { nickName: profile.nickName, avatarUrl: profile.avatarUrl });
  return Withprofile
  }else{
    const Withprofile = Object.assign(event.newmessage, { nickName: '用户已注销', avatarUrl: 'cloud://s-6gj66i67d89df4ed.732d-s-6gj66i67d89df4ed-1327638085/注销.jpg' });
    return Withprofile
  }
}