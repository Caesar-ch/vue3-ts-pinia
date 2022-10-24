<template>

  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <li v-for="item in list" :key="item.id" @mousemove="store.show(item)" @mouseleave="store.close(item)">
      <router-link :to='`/category/${item.id}`' @click="store.close(item)">{{item.name}} </router-link>
      <div class="layer" :class="{open:item.open}">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link :to="`/category/sub/${sub.id}`" @click="store.close(item)">
              <img :src="sub.picture" alt="">
              <p>{{sub.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { categoryStore } from '@/store/category'
const store = categoryStore()
// name: 'AppHeaderNav'
store.getList()
const list: any = computed(() => {
  return store.list
})

</script>

<style scoped lang="less">
@import '../assets/style/variables.less';
@import '../assets/style/mixins.less';

.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;

  >li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    >a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }

    &:hover {
      >a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }

    }
  }
}

.layer {
  &.open {
    height: 132px;
    opacity: 1;
    z-index: 199;
  }

  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0; //默认透明度为0--高度为0
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;

    li {
      width: 110px;
      text-align: center;

      img {
        width: 60px;
        height: 60px;
      }

      p {
        padding-top: 10px;
      }

      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
