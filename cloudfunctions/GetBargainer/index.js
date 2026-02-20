// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const result = await db.collection('User').where({
    openid:event.myopenid
  }).field({Bargainer:true}).get()
  
  let Bargainers = []

  if (result.data[0].Bargainer ) {
    Bargainers = result.data[0].Bargainer
  }

  console.log(result,Bargainers)

  let BargainersList = []
  // 遍历FriendApplication中的openid数组
  for (let Bargainer of Bargainers) {

    // 查询每个openid对应的用户信息

    const userinfoResult = await db.collection('User').where({ openid:Bargainer.BargainerOpenid}).field({
      avatarUrl: true,
      nickName: true,
    }).get()

    console.log('test1',userinfoResult)

    if (userinfoResult.data.length > 0) {
      // 获取用户信息并添加到列表中
      const userinfo = userinfoResult.data[0]
        BargainersList.push({
        openid:Bargainer.BargainerOpenid,
        avatarUrl: userinfo.avatarUrl,
        nickName: userinfo.nickName,
        Unread:Bargainer.Unread
      })
    } else {
      // 如果没有找到用户记录，则假设用户已注销
       BargainersList.push({
        openid:Bargainer.BargainerOpenid,
        avatarUrl: 'cloud://s-6gj66i67d89df4ed.732d-s-6gj66i67d89df4ed-1327638085/注销.jpg',
        nickName: '用户已注销'
      })
    }
  }

  // 返回所有朋友的用户信息
  return  BargainersList 
}