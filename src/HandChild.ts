import { defineVaporComponent, useModel, watchEffect } from 'vue'

// Same child as vapor/Child.vue, but written by hand and explicitly marked
// with defineVaporComponent — no SFC compiler involved.
export default defineVaporComponent(
  (props: { n: number; text: string }) => {
    const text = useModel(props, 'text')

    const label = document.createElement('p')
    label.append("Child's own text model: ")
    const value = document.createElement('strong')
    value.dataset.testid = 'text'
    label.append(value)
    watchEffect(() => (value.textContent = JSON.stringify(text.value)))

    const button = document.createElement('button')
    button.dataset.testid = 'set'
    button.textContent = '1. Set text from inside the child'
    button.addEventListener('click', () => (text.value = 'set by child'))

    return [label, button]
  },
  {
    props: { n: { type: Number, required: true }, text: { type: String, default: '' } },
    emits: ['update:text'],
  },
)
