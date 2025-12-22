<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <button class="ui-button" :type="type" v-bind="$attrs">
    <slot />
  </button>
</template>
