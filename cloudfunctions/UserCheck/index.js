// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 1. 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  // 前端传来的 openid 存在 event.openid 中
  const targetOpenid = event.openid

  if (!targetOpenid) {
    return { success: false, msg: '未提供 openid' }
  }

  try {
    // 2. 查询 User 集合
    // count() 比 get() 更轻量，只返回数量，不返回具体数据
    const countResult = await db.collection('User')
      .where({
        // 【重要提示】：
        // 云开发标准的做法是使用系统自动生成的 '_openid' 字段来标识用户。
        // 如果你的 User 表里存储用户 ID 的字段名叫 'openid' (不带下划线)，
        // 请把下面的 '_openid' 改成 'openid'。
        _openid: targetOpenid
      })
      .count()

    // 3. 根据查询结果判断
    // 如果 total 大于 0，说明找到了记录，用户已存在
    if (countResult.total > 0) {
      return {
        success: true, // 返回给前端用于判断
        msg: '用户已存在'
      }
    } else {
      return {
        success: false, // 返回给前端用于判断
        msg: '用户不存在'
      }
    }

  } catch (err) {
    console.error('数据库查询失败：', err)
    // 返回错误信息，只要 success 不是 true，前端就会走 else 分支
    return {
      success: false,
      msg: '查询出错',
      error: err
    }
  }
}