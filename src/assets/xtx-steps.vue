<script >
import { getCurrentInstance } from 'vue'
export default {
  name: 'XtxSteps',
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  render() {
    const { ctx } = getCurrentInstance()
    const items = ctx.$slots.default() //拿到插槽里的所有内容
    const dynamicItems = []//声明一个动态内容的数组
    items.forEach(item => {//遍历插槽所有内容
      if (item.type.name === 'XtxStepsItem') {
        dynamicItems.push(item)//如果名字为设定好的名字则为静态内容，直接push进去
      } else {
        item.children.forEach(c => {//若名字不对则代表为for循环遍历的内容，所以children才是真的内容
          dynamicItems.push(c)//拿到真的内容push
        })
      }
    })
    const itemsJsx = dynamicItems.map((item, i) => { //生成jsx标签
      return <div class="xtx-steps-item" class={{ active: i < props.active }}>
        <div class="step"> <span>{i + 1}</span></div >
        <div class="title"> {item.props.title} </div>
        <div class="desc"> {item.props.desc} </div>
      </div>
    })
    return <div class="xtx-steps" > {itemsJsx} </div>//将插入生成的返回出去就会生成对应模板
  }
}
</script>
<style lang="less">
@import '../../assets/style/mixins.less';
@import '../../assets/style/variables.less';

.xtx-steps {
  display: flex;
  text-align: center;

  &-item {
    flex: 1;

    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }

    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }

    &.active {
      .step {
        >span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }

        &::before,
        &::after {
          background: @xtxColor;
        }
      }

      .title {
        color: @xtxColor;
      }
    }

    .step {
      position: relative;

      >span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }

      &::after,
      &::before {
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
      }
    }

    .title {
      color: #999;
      padding-top: 12px;
    }

    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
