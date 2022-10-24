//思想以及架构，设想结果为什么样子
//这个函数将来：导入直接使用，也可以挂载到vue原型上
//import Message from 'Message.js' 使用Message({type:'error',text:'提示文字'})
//this.import.message({type:'error',text:'提示文字'})

//实现：落地-----------------------------------------------------------------------------------
// 实现使用函数调用xtx-message组件的逻辑
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 准备dom容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
// 定时器标识
let timer = null
const Message = ({ type, text }) => {
  // 实现：根据xtx-message.vue渲染消息提示
  // 1. 导入消息提示组件
  // 2. 将消息提示组件编译为虚拟节点（dom节点）
  //createVNode(组件，属性对象（传给这个组件的props参数）)
  const vnode = createVNode(XtxMessage, { type, text })
  // 3. 准备一个装载消息提示组件的DOM容器
  // 4. 把虚拟节点渲染DOM容器中
  render(vnode, div)
  // 5. 开启定时，移出DOM容器内容
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
export default Message
