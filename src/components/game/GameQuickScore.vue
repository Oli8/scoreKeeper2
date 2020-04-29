<template>
  <div class="buttons is-centered">
    <b-button v-for="option in options"
              @click="$emit('quick-score', option)"
              :key="option"
              size="is-large"
    >{{ option }}</b-button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameQuickScore',
  props: {
    options: Array as () => number[],
  },
};
</script>
