// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const result = await db.collection('User').where({openid:event.MyOpenid}).field({ChatGroup:true}).get()
  
  const query = result.data[0].ChatGroup
  

	const GroupIDs = []; // 初始化一个空数组来存储结果
for (let i = 0; i < query.length; i++) { // 使用 for 循环遍历 query 数组
 GroupIDs.push( // 将每个处理后的对象推入 GroupIDs 数组
  query[i].GroupID
 );
}


  console.log('query',query)
  console.log('GroupIDs',GroupIDs)

  if (query.length !== 0) {


    const records = await db.collection('GroupChat').where({
      _id: db.command.in(GroupIDs)
    }).field({GroupName:true,GroupAvatar:true}).get();
    console.log('records',records.data)

    const  GroupList = query.map(item => {
      // 在 array2 中找到与当前 item.id 匹配的对象
      const itemFromArray2 = records.data.find(subItem => subItem._id === item.GroupID);
      
      // 如果找到匹配的对象，则合并它们
      if (itemFromArray2) {
        return { ...item, ...itemFromArray2 };
      }
      
      // 如果没有找到匹配的对象，则只返回当前 item
      return item;
     });

    return  GroupList

    
      }else{
       const GroupList=[]
       return GroupList
      }

}