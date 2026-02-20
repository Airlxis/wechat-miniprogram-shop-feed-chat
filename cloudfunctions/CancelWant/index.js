// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const GoodID = event.GoodID
  const openid = event.openid

 await db.collection('goods').doc(GoodID).update({
    data: {
      // 使用数组的更新操作符push，如果arrayField不存在，则会创建一个新的数组并添加newElement
      WhoWant: db.command.pull(openid)
    }
  })

  

  await db.collection('User')
    .where({
      openid: openid // 根据唯一字段值查询记录
    })
    .get()
    .then(res => {
      if (res && res.data.length > 0) {
        // 获取到记录的_id
        const recordId = res.data[0]._id;
        // 向数组字段添加元素
        return db.collection('User')
          .doc(recordId)
          .update({
            data: {
              Want: db.command.pull(GoodID) // 使用 push 命令添加元素
            }
          });
      } else {
        throw new Error('No record found with the unique value');
      }
    })
    .then(updateRes => {
      // 成功添加元素
      console.log('Good added successfully:', updateRes);

      return{updateRes}
    })
    .catch(err => {
      // 添加失败处理
      console.error('Failed to add Good:', err);
      return{err}
    });
  
}