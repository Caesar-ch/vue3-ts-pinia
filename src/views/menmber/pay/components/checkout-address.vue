<template>
  <div class="checkout-address">
    <div class="text">
      <!-- 当没有值时就显示这个提醒 -->
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i />货<i />人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^d{3}\d{4}(\d{4})/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation.replace(/ /g,'')+showAddress.address}}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
    <!-- 对话框组件 -->
    <XtxDialog title="切换收货地址" v-model:visible="dialogVisible">
      <div class="text item" v-for="item in list" :class="{ active:selectedAddress && item.id === selectedAddress.id}"
        @click="selectedAddress = item" :key="item.id">
        <ul>
          <li><span>收<i />货<i />人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact.replace(/^d{3}\d{4}(\d{4})/,'$1****$2')}}</li>
          <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
      <!-- vue3.0 仅支持v-slot+template写法 -->
      <template v-slot:footer>
        <XtxButton @click="dialogVisible=false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="confirmAddress" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
  </div>
  <!-- 收货地址添加组件 -->
  <AddressEdit @onsuccess="successHandler" ref="addressEdit"></AddressEdit>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
name: 'CheckoutAddress'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
// 显示的地址
const showAddress = ref(null)
if (props.list.length) {
  //1.找到默认收货地址
  //2.没有默认就是数据的第一条
  //3.没有数据就提示添加
  const defaultAddress = props.list.find(item => item.isDefault === 1)
  if (defaultAddress) {
    showAddress.value = defaultAddress
  } else {
    //取出第一条
    // eslint-disable-next-line vue/no-setup-props-destructure
    showAddress.value = props.list[0]
  }
}
// 1. 在拥有根元素的组件中，触发自定义事件，有没有emits选项无所谓
// 2. 如果你的组件渲染的代码片段，vue3.0规范，需要在emits中申明你所触发的自定义事件
// 3. 提倡：你发了自定义事件，需要在emits选项申明下，代码可读性很高
const emit = defineEmits(['change'])
// 对话框显示隐藏
const dialogVisible = ref(false)
// 打开对话框
const openDialog = () => {
  dialogVisible.value = true
  selectedAddress.value = null
}
// 默认通知一个地址ID给父
emit('change', showAddress.value?.id)
// 选择的地址
const selectedAddress = ref(null)
// 确认地址
const confirmAddress = () => {
  dialogVisible.value = false
  showAddress.value = selectedAddress.value
  // 默认通知一个地址ID给父
  emit('change', showAddress.value?.id)
}
// 添加收货地址组件
const addressEdit = ref(null)
const openAddressEdit = (showAddress) => {
  addressEdit.value.open(showAddress)
}
// 成功
const successHandler = (formData) => {
  const editAddress = props.list.find(item => item.id === formData.id)
  if (editAddress) {
    // 修改
    for (const key in editAddress) {
      //更新视图
      editAddress[key] = formData[key]
    }
  } else {
    //更新视图
    const json = JSON.stringify(formData)  // 需要克隆下，不然使用的是对象的引用，因为如果不客隆，数组里存的是引用，因为当关闭对话框需要清空信息，让下次表单为空，若是引用，则清空了，数组新加的值也就没了，所以需要拷贝
    // eslint-disable-next-line vue/no-mutating-props

    props.list.unshift(JSON.parse(json))
    console.log(props.list);

  }
}
</script>
<style scoped lang="less">
@import '../../../../assets/style/mixins.less';
@import '../../../../assets/style/variables.less';

.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }

  .xtx-dialog {
    .text {
      flex: 1;
      min-height: 90px;
      display: flex;
      align-items: center;

      &.item {
        border: 1px solid #f5f5f5;
        margin-bottom: 10px;
        cursor: pointer;

        &.active,
        &:hover {
          border-color: @xtxColor;
          background: lighten(@xtxColor, 50%);
        }

        >ul {
          padding: 10px;
          font-size: 14px;
          line-height: 30px;
        }
      }
    }

  }
}
</style>
