<template>
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <ul class="carousel-body">
      <li class="carousel-item" v-for="(item,index) in sliders " :key="'xtr-carousel'+item.id"
        :class="{fade: i===index}">
        <RouterLink v-if="item.hrefUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span @click="i = index" v-for="(item,index) in sliders" :key="i" :class="{active: index=== i}"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue'
// const props = defineProps<{
//   sliders: []
// }>()
const props = defineProps({
  sliders: {
    type: [],
    default: () => []
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoPlay: {
    type: Boolean,
    default: true
  }
})
// 默认显示的图片的索引
const i = ref(0)
//自动播放
let timer: any = null
const autoPlayFn = () => {
  clearInterval(timer)//防止定时器重复添加，例如鼠标移除时开启定时器，应当
  timer = setInterval(() => {
    i.value++
    if (i.value >= props.sliders.length) {
      i.value = 0
    }
  }, props.duration)
}
watch(() => props.sliders, (newVal) => {
  // 有数据&开启自动播放，才调用自动播放函数
  if (newVal.length && props.autoPlay) {
    i.value = 0
    autoPlayFn()
  }
}, { immediate: true })
const stop = () => {
  if (timer) clearInterval(timer)
}
const start = () => {
  if (props.sliders.length && props.autoPlay) {
    autoPlayFn()
  }
}
//点击前进后腿
const toggle = (step: number) => {
  const newIndex = step + i.value
  if (newIndex > props.sliders.length - 1) {
    i.value = 0
    return
  }
  if (newIndex < 0) {
    i.value = props.sliders.length - 1
    return
  }
  i.value = newIndex
}
// 组件消耗，清理定时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="less">
@import '../../assets/style/mixins.less';
@import '../../assets/style/variables.less';

.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;

  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }

    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;

      &.fade {
        opacity: 1;
        z-index: 1;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;

        ~span {
          margin-left: 12px;
        }

        &.active {
          background: #fff;
        }
      }
    }

    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, .2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;

      &.prev {
        left: 20px;
      }

      &.next {
        right: 20px;
      }
    }
  }

  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}

.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;

  >a {
    width: 240px;
    text-align: center;

    img {
      padding: 20px;
      width: 230px !important;
      height: 230px !important;
    }

    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }

    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
