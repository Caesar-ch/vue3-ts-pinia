<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked">☑ </i>
    <i v-else class="iconfont icon-unchecked"> ☐</i>
    <span v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
name: 'XtxCheckbox'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(["update:modelValue", "change"])
// const checked = ref(false)
// const changeChecked = () => {
//   checked.value = !checked.value
//   // 使用emit通知父组件数据的改变
//   emit('update:modelValue', checked.value)
// }
// // 使用侦听器，得到父组件传递数据，给checked数据
// watch(() => props.modelValue, () => {
//   checked.value = props.modelValue
// }, { immediate: true })

//借助vueuse实现，内部其实一样
const checked = useVModel(props, 'modelValue', emit)
const changeChecked = () => {
  const newVal = !checked.value
  // 通知父组件
  checked.value = newVal
  // 让组件支持change事件
  emit('change', newVal)
}

</script>
<style scoped lang="less">
@import '../../assets/style/mixins.less';
@import '../../assets/style/variables.less';

.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;

  .icon-checked {
    color: @xtxColor;

    ~span {
      color: @xtxColor;
    }
  }

  i {
    position: relative;
    top: 1px;
    font-size: 35px;
  }

  span {
    margin-left: 2px;
  }
}
</style>
