<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function onChange(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <select :value="props.modelValue" @change="onChange" v-bind="$attrs">
    <slot />
  </select>
</template>
