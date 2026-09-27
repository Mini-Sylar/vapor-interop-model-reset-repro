<template>
  <p>
    Child's own <code>text</code> model: <strong data-testid="text">{{ JSON.stringify(text) }}</strong>
  </p>
  <button data-testid="set" @click="text = 'set by child'">1. Set text from inside the child</button>
  <p><small>Unrelated prop from the parent: <code>n = {{ n }}</code></small></p>
</template>

<script setup lang="ts" vapor>
// Uncontrolled: the parent never binds v-model:text, so the child owns it.
const text = defineModel<string>('text', { default: '' })
defineProps<{ n: number }>()
</script>
