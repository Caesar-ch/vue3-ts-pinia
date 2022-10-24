import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css' //正确的引入
import 'normalize.css'
import '@/assets/style/common.less'
import '@/assets/style/mixins.less'
import '@/assets/style/variables.less'
import { createPinia } from 'pinia'
import { router } from '@/router'
import UI from '@/components/library/index'
import '@/mock' //将来若接口开发好了，注释掉这个导入就是走发送请求地址去请求数据
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.use(UI)
app.mount('#app')
