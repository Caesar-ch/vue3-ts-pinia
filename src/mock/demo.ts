import Mock from 'mockjs'

// 基础配置
Mock.setup({
  // 随机延时500-1000毫秒
  timeout: '500-1000'
})
// 拦截请求，
// 第一个参数：url，使用正则去匹配
// 第二个参数：请求方式
// 第三个参数： 生成数据的函数
// Mock.mock('匹配的地址','请求方法/get/post','result/()=>{ return [result]  }')
// Mock.mock(/\/my\/test/, 'get', () => {return { msg: '请求测试接口成功', result: [] }})
Mock.mock(/\/my\/test/, 'get', () => {
  const arr = []
  for (let i = 0; i < 5; i++) {
    //模拟单条数据
    // arr.push(Mock.mock('@id'))//讲一个mock类型为id的数字push进数组里
    // {msg: '请求数据成功', result: Array(5)}
    //  msg: "请求数据成功"
    //  result: Array(5)
    //  0: "630000199009188168"
    //  1: "220000200503065648"
    //  2: "310000200904144146"
    //  3: "230000197003296754"
    //  4: "370000201807316896"
    //  length: 5

    //模拟对象数据
    arr.push(
      Mock.mock({
        id: '@id', //属性名后根mock的数据类型，@id为占位符，在mock里会生成类型为id的数据，最后填充到@id这个占位符这里
        name: '@cname'
      })
    )
  }
  //  result: Array(5)
  //  0: {id: '820000201509052895', name: '顾明'}
  //  1: {id: '540000198409182885', name: '姜明'}
  //  2: {id: '500000200805146678', name: '段娟'}
  //  3: {id: '310000197307241349', name: '蒋秀兰'}
  //  4: {id: '120000198305077759', name: '杜强'}
  //  length: 5
  return { msg: '请求数据成功', result: arr }
})
