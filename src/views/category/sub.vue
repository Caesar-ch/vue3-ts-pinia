<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter @filter-change="changeFilter"></SubFilter>
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="changeSort" />
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodList" :key="item.id">
            <GoodsItem :goods="item" />
          </li>
        </ul>
        <!-- 加载 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup >
import { ref, watch, computed } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
const goodsList = ref([])
const goodList = computed(() => {
  return [...goodsList.value]
})
const loading = ref(false)
const finished = ref(false)
const route = useRoute()
// 查询参数
let reqParams = {
  page: 1,
  pageSize: 20
}
const getData = () => {
  loading.value = true
  reqParams.categoryId = route.params.id
  findSubCategoryGoods(reqParams).then(({ result }) => {
    if (result.items.length) {
      goodsList.value.push(...result.items)
      reqParams.page++
    } else {
      // 加载完毕
      finished.value = true
    }
    // 请求结束
    loading.value = false
  })
}
// 切换二级分类重新加载
watch(() => route.params.id, (newVal) => {
  if (newVal && route.path === ('/category/sub/' + newVal)) {
    goodsList.value = []
    reqParams = {
      page: 1,
      pageSize: 20
    }
    finished.value = false
  }
})

// 监听筛选区改变
const changeFilter = (filterParams) => {
  console.log(filterParams);

  reqParams = { ...reqParams, ...filterParams }
  reqParams.page = 1
  goodsList.value = []
  finished.value = false
}
// 监听排序改变
const changeSort = (sortParams) => {
  console.log(sortParams);

  reqParams = { ...reqParams, ...sortParams }
  reqParams.page = 1
  goodsList.value = []
  finished.value = false
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;

    li {
      margin-right: 20px;
      margin-bottom: 20px;

      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
