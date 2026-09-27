import { createApp, createVaporApp, vaporInteropPlugin } from 'vue'
import './style.css'
import PlainParent from './plain/Parent.vue'
import VaporParent from './vapor/Parent.vue'
import InteropParent from './InteropParent.vue'
import InteropHandParent from './InteropHandParent.vue'

// 1. VDOM only.
createApp(PlainParent).mount('#vdom-only')

// 2. Vapor only, its own root, no VDOM involved at all.
createVaporApp(VaporParent).mount('#vapor-only')

// 3. Interop: a VDOM parent rendering a Vapor-compiled child. This is the
// one that reproduces the bug; 1 and 2 don't.
const interopApp = createApp(InteropParent)
interopApp.use(vaporInteropPlugin)
interopApp.mount('#interop')

// 4. Same as 3, but the child is written by hand with defineVaporComponent
// (no SFC compiler), to rule out the component simply not being marked Vapor.
const interopHandApp = createApp(InteropHandParent)
interopHandApp.use(vaporInteropPlugin)
interopHandApp.mount('#interop-hand')
