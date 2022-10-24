<template>
  <div class='home-category' @mouseleave="categoryId = null">
    <ul class="menu">
      <li :class="{active:categoryId === item.id}" v-for="item in list" :key="item.id"
        @mouseenter="categoryId = item.id">
        <RouterLink :to="`/category/${item.id}`">{{item.name}}</RouterLink>
        <template v-if="item.children">
          <RouterLink v-for="sub in item.children" :key="sub.id" :to="`/category/${sub.id}`">{{sub.name}}</RouterLink>
        </template>
        <template v-else>
          <XtxSkeleton width="50px" height="20px" bg="rgba(255,255,255,0.2)" style="margin-right:5px ;">
          </XtxSkeleton>
          <XtxSkeleton width="50px" height="20px" bg="rgba(255,255,255,0.2)"></XtxSkeleton>

        </template>
      </li>
    </ul>
    <!-- 总体思路当鼠标进入时，将当前categoryId置为这个项的id，根据这个id找当这一项，拿到这一项的good进行判断渲染 -->
    <!-- 弹层 -->
    <div class="layer">
      <h4 v-if="currCategory"> {{currCategory.id == 'brand'?'品牌': '分类' +'推荐' }}<small>根据您的购买或浏览记录推荐</small></h4>
      <ul v-if=" currCategory && currCategory.goods">
        <li v-for="item in currCategory.goods" :key="item.id">
          {{item.name}}
          <RouterLink to="/">
            <img :src="item.picture" alt="123">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <ul v-if="currCategory && currCategory.brand && currCategory.brand.length">
        <li class="brand" v-for="item in currCategory.brand" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{item.place}}</p>
              <p class="name ellipsis">{{item.name}}</p>
              <p class="desc ellipsis-2">{{item.desc}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { categoryStore } from '@/store/category'
import { computed, reactive, ref } from 'vue';
import { findBrand } from '@/api/home'
import XtxSkeleton from '@/components/library/xtx-skeleton.vue';
const store = categoryStore()
const brand = reactive({
  id: 'brand',
  name: '品牌',
  children: [{ id: 'brand-chilren', name: '品牌推荐' }],
  brand: []//只有这一项有brand所以当根据id找到当前项，然后判断当前项有brand时显示这一项
})
const list = computed(() => {
  const mylist = store.list.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      children: item.children && item.children.slice(0, 2),
      goods: item.goods
    }
  })
  mylist.push(brand)
  return mylist
})

//得到弹出层的数据
// 获取当前分类逻辑
const categoryId = ref(null)//记录当前的id
const currCategory = computed(() => {//根据id拿到这一项，弹出层渲染这一项的goods部分
  return list.value.find(item => item.id === categoryId.value)
})
//api获取
findBrand(6).then(res => {//渲染菜单拼接请求到的数据
  brand.brand = res.result
})
</script>

<style scoped lang='less'>
@import '../../../assets/style/variables.less';
@import '../../../assets/style/mixins.less';

.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;

  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;

      &:hover,
      &.active {
        background: @xtxColor;
      }

      a {
        margin-right: 4px;
        color: #fff;

        &:first-child {
          font-size: 16px;
        }
      }
    }
  }

  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;

    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;

      small {
        font-size: 16px;
        color: #666;
      }
    }

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;

        &:nth-child(3n) {
          margin-right: 0;
        }

        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;

          &:hover {
            background: #e3f9f4;
          }

          img {
            width: 95px;
            height: 95px;
          }

          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;

            .name {
              font-size: 16px;
              color: #666;
            }

            .desc {
              color: #999;
            }

            .price {
              font-size: 22px;
              color: @priceColor;

              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }

    li.brand {
      height: 180px;

      a {
        align-items: flex-start;

        img {
          width: 120px;
          height: 160px;
        }

        .info {
          p {
            margin-top: 8px;
          }

          .place {
            color: #999;
          }
        }
      }
    }
  }

  &:hover {
    .layer {
      display: block;
    }
  }
}

.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}

@keyframes fade {
  from {
    opacity: 0.2;
  }

  to {
    opacity: 1;
  }
}
</style>
