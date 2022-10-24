<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p><span>100</span><span>人购买</span></p>
        <p><span>99.99%</span><span>好评率</span></p>
      </div>
      <div class="tags" v-if="commentInfo">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item,i) in commentInfo.tags" :key="item.title" href="javascript:;"
            :class="{active:currTagIndex === i}" @click="changeTag(i)">
            {{item.title}} ({{item.tagCount}}) </a>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort">
      <span>排序：</span>
      <a @click="changeSort(null)" href="javascript:;" :class="{active:reqParams.sortField=== null}">默认</a>
      <a @click="changeSort('praiseCount')" href="javascript:;"
        :class="{active:reqParams.sortField=== 'praiseCount'}">最热</a>
      <a @click="changeSort('createTime')" href="javascript:;"
        :class="{active:reqParams.sortField=== 'createTime'}">最新</a>
    </div>
    <!-- 列表 -->
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i+'1'" class="iconfont icon-wjx01"></i>
            <i v-for="i in 5-item.score" :key="i+'2'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i> {{item.praiseCount}}</span>
          </div>
        </div>
      </div>
      <!-- 分页组件 -->
      <div class="xtx-pagination" v-if="total>0">
        <XtxPagination @current-change="changePager" :total="total" :current-page="reqParams.page" />
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import { findCommentInfoByGoods, findCommentListByGoods } from '@/api/goods'
import GoodsCommentImage from './goods-comment-image.vue'
import { ref, inject, reactive, watch } from 'vue'
name: 'GoodsComment'
const goods = inject('goods')
//发请求拿到，这个产品的评论标签
const getCommentInfo = (goods) => {
  const commentInfo = ref(null)
  findCommentInfoByGoods(goods.id).then(data => {
    // type 的目的是将来点击可以区分点的是不是标签
    data.result.tags.unshift({ type: 'img', title: '有图', tagCount: data.result.hasPictureCount })
    data.result.tags.unshift({ type: 'all', title: '全部评价', tagCount: data.result.evaluateCount })
    commentInfo.value = data.result
  })
  return commentInfo
}
//渲染标签信息：全部评价，有图
const commentInfo = getCommentInfo(goods)
console.log(commentInfo);

// 记录当前激活的索引，切换标签的状态
const currTagIndex = ref(0)
const changeTag = (i) => {
  currTagIndex.value = i
  // 设置有图和标签条件
  const currTag = commentInfo.value.tags[i]
  if (currTag.type === 'all') {
    reqParams.hasPicture = false
    reqParams.tag = null
  } else if (currTag.type === 'img') {
    reqParams.hasPicture = true
    reqParams.tag = null
  } else {
    reqParams.hasPicture = false
    reqParams.tag = currTag.title
  }
  //更改标签后就将页面改为1，回去触发watch，重新发请求拿数据,若放在watch，你监听它，又修改它就会有问题，会造成watch的同步触发
  reqParams.page = 1
}
//评论列表渲染
// 筛选条件准备
const reqParams = reactive({
  page: 1,
  pageSize: 10,
  hasPicture: null,
  tag: null,
  sortField: null
})
// 改变排序
const changeSort = (type) => {
  reqParams.sortField = type
  reqParams.page = 1
}
// 初始化或者筛选条件改变后，获取列表数据。
const commentList = ref([])
//记录总数用于给子组件计算展示
const total = ref(0)
watch(reqParams, async () => {
  const data = await findCommentListByGoods(goods.id, reqParams)
  commentList.value = data.result.items
  total.value = data.result.counts
}, { immediate: true })
//处理种类
const formatSpecs = (specs) => {
  return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
}
//处理用户昵称，保护隐私
const formatNickname = (nickname) => {
  return nickname.substr(0, 1) + '****' + nickname.substr(-1)
}
// 改变分页函数
const changePager = (np) => {
  //接收页码的变化，就可以发起请求拿到新数据
  reqParams.page = np
}
</script>

<style scoped lang="less">
@import '../../../assets/style/mixins.less';
@import '../../../assets/style/variables.less';

.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;

    .data {
      width: 340px;
      display: flex;
      padding: 20px;

      p {
        flex: 1;
        text-align: center;

        span {
          display: block;

          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }

          &:last-child {
            color: #999;
          }
        }
      }
    }

    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;

      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }

      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        >a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;

          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }

          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }

  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;

    >span {
      margin-left: 20px;
    }

    >a {
      margin-left: 30px;

      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }

  .list {
    padding: 0 20px;

    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;

      .user {
        width: 160px;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        span {
          padding-left: 10px;
          color: #666;
        }
      }

      .body {
        flex: 1;

        .score {
          line-height: 40px;

          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }

          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }

      .text {
        color: #666;
        line-height: 24px;
      }

      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
