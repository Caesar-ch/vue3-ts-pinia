<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click=" isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema="mySchema" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" name="account" v-model="form.account" type="text"
              placeholder="请输入用户名或手机号" />
          </div>
          <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" name="password" v-model="form.password" type="password"
              placeholder="请输入密码" />
          </div>
          <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.mobile}" name="mobile" v-model="form.mobile" type="text"
              placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.code}" name="code" v-model="form.code" type="password" placeholder="请输入验证码" />
            <span @click="send()" class="code">
              {{time===0?'发送验证码':`${time}秒后发送`}}
            </span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a @click="login()" href="javascript:;" class="btn">登 录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import veeSchema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { userStore } from '@/store/user'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { cartStore } from '@/store/cart'
name: 'LoginForm'
const isMsgLogin = ref(false)
// 表单对象数据
const form = reactive({
  isAgree: true,
  account: null,
  password: null,
  mobile: null,
  code: null
})

// 校验规则对象
const mySchema = {
  account: veeSchema.account,
  password: veeSchema.password,
  mobile: veeSchema.mobile,
  code: veeSchema.code,
  isAgree: veeSchema.isAgree
}
const formCom = ref(null)
watch(isMsgLogin, () => {
  // 还原数据
  form.isAgree = true
  form.account = null
  form.password = null
  form.mobile = null
  form.code = null
  // 补充校验效果清除，Form组件提供resetForm()
  formCom.value.resetForm()
})
// pause 暂停 resume 开始
// useIntervalFn(回调函数,执行间隔,是否立即开启)
const time = ref(0)
const { pause, resume } = useIntervalFn(() => {
  time.value--
  if (time.value <= 0) {
    pause()
  }
}, 1000, false)
//销毁组件销毁定时器
onUnmounted(() => {
  pause()
})
// 发送短信
const send = async () => {
  const valid = mySchema.mobile(form.mobile)//验证手机号
  if (valid === true) {
    // 通过
    if (time.value === 0) {
      // 没有倒计时才可以发送
      await userMobileLoginMsg(form.mobile)
      Message({ type: 'success', text: '发送成功' })
      time.value = 60
      resume()
    }
  } else {
    // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
    formCom.value.setFieldError('mobile', valid)
  }
}
//拿到对应store
const store = userStore()
const router = useRouter()
const route = useRoute()
// 需要在点击登录的时候对整体表单进行校验
const login = async () => {
  // Form组件提供了一个 validate 函数作为整体表单校验，当是返回的是一个promise
  const valid = await formCom.value.validate()
  const { account, password, mobile, code } = form
  try {
    let data = {}
    if (valid) {
      if (isMsgLogin.value) {
        console.log('1111');
        data = await userMobileLogin({ mobile, code })
      } else {
        data = await userAccountLogin({ account, password })
      }
      if (data.result) { //范围判断否则data取不到值
        const datadata = data.result
        const { id, account, nickname, avatar, token, mobile } = datadata
        store.setUserInfo({ id, account, nickname, avatar, token, mobile })
        const catrstore = cartStore()
        catrstore.mergeLocalCart().then(() => {
          router.push(route.query.redirectUrl || '/')
          Message({ type: 'success', text: '登陆成功' })
        })
      }

    }
  } catch (err: any) {
    Message({ type: 'error', text: err.response.data.message || '登录失败' })
  }
}

</script>
<style lang="less" scoped>
@import '../../../assets/style/mixins.less';
@import '../../../assets/style/variables.less';

// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: @xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: @priceColor;
          }

          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
