<template>
  <Child :n="n" />
  <button data-testid="bump" @click="n++">2. Re-render the parent (n++)</button>
</template>

<script setup lang="ts" vapor>
import { ref } from 'vue'
import Child from './Child.vue'

const n = ref(0)
</script>
