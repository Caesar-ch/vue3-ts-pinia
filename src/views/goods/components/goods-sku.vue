<template>

  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img :class="{selected:val.selected}" @click="clickSpecs(item,val)" v-if="val.picture" :src="val.picture"
            :title="val.name">
          <span :class="{selected:val.selected}" @click="clickSpecs(item,val)" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script lang="ts" setup>

import getPowerSet from '@/vender/power-set'
name: 'GoodsSku'
const spliter = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  // console.log(skus);

  const pathMap = {}
  skus.forEach(sku => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory) {
      // 2. 得到sku属性值数组

      const specs = sku.specs.map(spec => spec.valueName)
      // 3. 得到sku属性值数组的子集

      const powerSet = getPowerSet(specs)
      // 4. 设置给路径字典对象
      powerSet.forEach(set => {
        const key = set.join(spliter)
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  // console.log(pathMap);

  return pathMap
}


const props = defineProps({
  goods: {
    type: Object,
    default: () => ({ specs: [], skus: [] })
  },
  skuId: {
    type: String,
    default: ''
  }
})
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      spec.values.forEach(val => {
        val.selected = val.name === value
      })
    })
  }
}
if (props.skuId) {
  initSelectedStatus(props.goods, props.skuId)
}
const pathMap = getPathMap(props.goods.skus)
// console.log(props.goods.skus);

// console.log('pathmap---');
// console.log(pathMap)
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach(spec => {
    const selectedVal = spec.values.find(val => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}
// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {

  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs)
    // console.log(selectedArr);
    spec.values.forEach(val => {
      // 已经选中的按钮不用判断
      if (val.name === selectedArr[i]) return false
      // 未选中的替换对应的值
      selectedArr[i] = val.name

      // console.log(selectedArr);

      // 过滤无效值得到key
      const key = selectedArr.filter(v => v).join(spliter)
      // 设置禁用状态
      val.disabled = !pathMap[key]
    })
  })
}
const emit = defineEmits(['change'])
updateDisabledStatus(props.goods.specs, pathMap)
const clickSpecs = (item, val) => {
  // 如果是禁用状态不作为
  if (val.disabled) return false
  // 1. 选中与取消选中逻辑
  if (val.selected) {
    val.selected = false
  } else {
    item.values.find(bv => { bv.selected = false })
    val.selected = true
  }
  // 点击的时候更新禁用状态
  updateDisabledStatus(props.goods.specs, pathMap)
  // 触发change事件将sku数据传递出去
  const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)//过滤undefined后长度没变，则代表为有效值选择完整，去传给父组件
  if (selectedArr.length === props.goods.specs.length) {
    const skuIds = pathMap[selectedArr.join(spliter)]
    //找出完整的信息，规格库存，价格，根据选择的情况，找出对应的sku，传给父组件，用于父组件最后交给购物车
    const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
    // 传递
    emit('change', {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      specsText: sku.specs.reduce((p, n) => `${p} ${n.name}:${n.valueName}`, '').replace(' ', '')//去掉首尾的空字符串
    })
    // console.log(sku.specs.reduce((p, n) => `${p} ${n.name}:${n.valueName}`, '').replace(' ', ''));

  } else {
    //传给父组件空对象，父组件判断是否要传递给购物车，若为空就不传递了，用于父组件判断，若不传，则无法比较
    emit('change', {})
  }
}
</script>
<style scoped lang="less">
@import '../../../assets/style/mixins.less';
@import '../../../assets/style/variables.less';

.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: @xtxColor;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      >img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }

      >span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
