// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const result = await db.collection('User').where({
    openid:event.myopenid
  }).field({Friends:true}).get()
  
  let Friends = []

  if (result.data[0].Friends ) {
    Friends = result.data[0].Friends
  }

  console.log(result,Friends)

  let FriendsList = []
  // 遍历FriendApplication中的openid数组
  for (let Friend of Friends) {

    // 查询每个openid对应的用户信息

    const userinfoResult = await db.collection('User').where({ openid:Friend.FriendOpenid}).field({
      avatarUrl: true,
      nickName: true,
    }).get()

    console.log('test1',userinfoResult)

    if (userinfoResult.data.length > 0) {
      // 获取用户信息并添加到列表中
      const userinfo = userinfoResult.data[0]
      FriendsList.push({
        openid: Friend.FriendOpenid,
        avatarUrl: userinfo.avatarUrl,
        nickName: userinfo.nickName,
        Unread: Friend.Unread
      })
    } else {
      // 如果没有找到用户记录，则假设用户已注销
       FriendsList.push({
        openid: Freind.FriendOpenid,
        avatarUrl: 'cloud://s-6gj66i67d89df4ed.732d-s-6gj66i67d89df4ed-1327638085/注销.jpg',
        nickName: '用户已注销'
      })
    }
  }

  // 返回所有朋友的用户信息
  return  FriendsList 
}