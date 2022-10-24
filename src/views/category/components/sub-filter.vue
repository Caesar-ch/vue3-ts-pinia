<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">

        <a @click="changeBrand(item.id ) " :class="{active: filterData.selectedBrand === item.id }" href="javascript:;"
          v-for="item in filterData.brands" :key="item.id">{{item.name}} </a>
      </div>
    </div>
    <div class="item" v-for="p in  filterData.saleProperties" :key="p.id">
      <div class="head">{{p.name}} :</div>
      <div class="body">
        <a :class="{active:p.selectedProp === i.id}" @click="changeAttr(p,i.id)" href="javascript:;"
          v-for="i in p.properties" :key="i.id">{{i.name}}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script lang="ts" setup>
import { findSubCategoryFilter } from '@/api/category'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
name: 'SubFilter'
const route = useRoute()
const filterData = ref(null)
const filterLoading = ref(false)
// 4. 分类发生变化的时候需要重新获取筛选数据，需要使用侦听器
watch(() => route.params.id, (newVal, oldVal) => {
  // 当你从二级分类去顶级分类也会拿到ID，不能去加载数据因为它不是二级分类的ID
  if (newVal && route.path === ('/category/sub/' + newVal)) {
    filterLoading.value = true//每次加载先显示骨架平
    newVal && findSubCategoryFilter(route.params.id).then(({ result }) => {
      // 添加品牌 {全部}
      result.selectedBrand = null
      result.brands.unshift({ id: null, name: '全部' })
      // 销售属性 {全部}
      result.saleProperties.forEach(p => {
        p.selectedProp = null
        //每一个选择属性的第一个都加上 {全部}
        p.properties.unshift({ id: null, name: '全部' })
      })
      filterData.value = result//当数据请求到
      filterLoading.value = false//改为显示数据
    })
  }
}, { immediate: true })
// 获取筛选参数
const getFilterParams = () => {
  const filterParams = {}
  const attrs = []
  filterParams.brandId = filterData.value.selectedBrand
  filterData.value.saleProperties.forEach(p => {
    const attr = p.properties.find(attr => attr.id === p.selectedProp)
    if (attr && attr.id !== undefined) {
      attrs.push({ groupName: p.name, propertyName: attr.name })
    }
  })
  if (attrs.length) filterParams.attrs = attrs
  return filterParams
}
const emit = defineEmits(['filter-change'])
// 选择品牌
const changeBrand = (brandId) => {
  if (filterData.value.selectedBrand === brandId) return
  filterData.value.selectedBrand = brandId
  console.log('123');

  emit('filter-change', getFilterParams())
}
// 选中属性
const changeAttr = (p, attrId) => {
  if (p.selectedProp === attrId) return
  p.selectedProp = attrId
  emit('filter-change', getFilterParams())
}

</script>
<style scoped lang='less'>
@import '../../../assets/style/mixins.less';
@import '../../../assets/style/variables.less';

// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;

  .xtx-skeleton {
    padding: 10px 0;
  }

  .item {
    display: flex;
    line-height: 40px;

    .head {
      width: 80px;
      color: #999;
    }

    .body {
      flex: 1;

      a {
        margin-right: 36px;
        transition: all .3s;
        display: inline-block;

        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
