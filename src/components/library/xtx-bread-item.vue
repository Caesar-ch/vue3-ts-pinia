<template>
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to">
      <slot />
    </RouterLink>
    <span v-else>
      <slot />
    </span>
  </div>
</template>
<script lang="ts" setup>

name: 'XtxBreadItem'
const props = defineProps({
  to: {
    type: [String, Object]
  }
})

</script>
