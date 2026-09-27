# Vapor interop: a Vapor child's uncontrolled `defineModel` resets when its VDOM parent re-renders

Minimal repro, distilled from a real bug in [vael-ui](https://github.com/Mini-Sylar/vael-ui)'s
`Combobox` (its input text goes blank after picking an option, when its parent is a plain VDOM
component). No third-party dependency, just `vue`.

## Versions

- `vue`: `3.6.0-rc.9`
- `@vitejs/plugin-vue`: `^6.0.9`
- `vite`: `^8.3.0`

## Setup

```sh
pnpm install
pnpm dev
```

Open the printed local URL. `Parent.vue` and `Child.vue` (`src/plain/` and `src/vapor/`,
byte-for-byte identical except `src/vapor/`'s `<script setup>` tags carry an extra `vapor`
attribute) are mounted three ways:

1. **VDOM only**: `createApp(PlainParent).mount(...)`.
2. **Vapor only**: `createVaporApp(VaporParent).mount(...)`, its own root, no VDOM involved.
3. **Interop**: `createApp(InteropParent).use(vaporInteropPlugin).mount(...)`, a plain VDOM
   parent rendering the Vapor-compiled `Child`.
4. **Interop, hand-written child**: same as 3, but the child is written by hand with
   `defineVaporComponent(...)` (`src/HandChild.ts`), no SFC compiler involved.

In each column, click **1** (sets the child's model from inside the child), then **2**
(re-renders the parent by changing an unrelated prop).

Both interop columns also print a sanity check that `Child` really is a Vapor component, not an
unmarked one falling back to VDOM: `Child.__vapor` (the SFC compiles to
`defineVaporComponent(...)`) and `isVaporComponent()` on the child's mounted instance
(`childVNode.component`, read from the VDOM parent) are both `true`.

## What it does

`Child.vue` owns a model its parent never binds:

```ts
const text = defineModel<string>('text', { default: '' })
defineProps<{ n: number }>()
```

The parent only passes an unrelated prop:

```vue
<Child :n="n" />
<button @click="n++">Re-render the parent</button>
```

## Expected

After clicking 1 then 2, the child's `text` stays `"set by child"` in all three columns. The
parent never passed `text`, so re-rendering the parent shouldn't touch it.

## Actual

| Mount      | After 1          | After 2          |
| ---------- | ---------------- | ---------------- |
| VDOM only  | `"set by child"` | `"set by child"` |
| Vapor only | `"set by child"` | `"set by child"` |
| Interop    | `"set by child"` | `""`             |
| Interop, hand-written child | `"set by child"` | `""` |

Only the interop mount resets the model to its default. Same result in dev and in a production
build (`vite build && vite preview`). Without a `default` it resets to
`undefined` instead. Any uncontrolled `defineModel` in a Vapor component used from a VDOM parent
is affected, so a component's own open state, active tab, typed text and so on are wiped whenever
its parent happens to re-render.
