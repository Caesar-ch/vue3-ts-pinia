import defaultImg from '@/assets/images/200.png'
// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
// import defaultImg from '@/assets/images/200.png'
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import { App } from 'vue'
// const importFn = require.context('./', false, /\.vue$/)
const importFn = import.meta.glob('./*.vue')
export default {
  install: (app: App) => {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    // 批量注册全局组件
    // importFn.keys().forEach(key => { //这个是webpack下使用
    //   // 导入组件
    //   const component = importFn(key).default
    //   // 注册组件
    //   app.component(component.name, component)
    // })
    // 批量注册全局组件
    Object.keys(importFn).forEach((file) => {
      const component = importFn[file]
      app.component(component.name, component)
    })
    defineDirective(app)
  }
}

//指令
const defineDirective = (app: App) => {
  app.directive('lazy', {
    mounted(el, binding) {
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            observer.unobserve(el)
            el.onerror = () => {
              el.src = defaultImg
            }
            el.src = binding.value
          }
        },
        {
          threshold: 0
        }
      )
      observer.observe(el)
    }
  })
}
