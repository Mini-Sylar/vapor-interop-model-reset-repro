<template>
  <Child :n="n" />
  <button data-testid="bump" @click="n++">2. Re-render the parent (n++)</button>
  <p>
    <small>
      Sanity check that <code>Child</code> really is mounted as Vapor:
      <code>Child.__vapor</code> = <code data-testid="def-vapor">{{ defIsVapor }}</code>,
      <code>isVaporComponent(childVNode.component)</code> =
      <code data-testid="is-vapor">{{ instanceIsVapor }}</code>
    </small>
  </p>
</template>

<script setup lang="ts">
// Plain VDOM parent rendering the hand-written defineVaporComponent Child.
import { getCurrentInstance, isVaporComponent, onMounted, ref } from 'vue'
import type { VNode } from 'vue'
import Child from './HandChild'

const n = ref(0)

const defIsVapor = (Child as { __vapor?: boolean }).__vapor === true
const instanceIsVapor = ref<boolean | null>(null)
const self = getCurrentInstance()!
onMounted(() => {
  const children = self.subTree.children as VNode[]
  const childVNode = children.find((vnode) => vnode.type === Child)
  instanceIsVapor.value = isVaporComponent(childVNode?.component)
})
</script>
