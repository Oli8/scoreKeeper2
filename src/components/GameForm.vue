<template>
  <div class="container">
    <b-field label="Add a player">
      <b-input v-model="pendingPlayerName"></b-input>
    </b-field>
    <b-field label="Step">
      <b-input v-model="step" type="number"></b-input>
    </b-field>
    <div class="field">
      <b-checkbox v-model="finishLine.enabled"
                  @input="focusFinishLineField"
      >Finish line</b-checkbox>
      <b-input v-model="finishLine.value"
               ref="finishLineField"
               type="number"
               v-show="finishLine.enabled"></b-input>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameForm',
  data() {
    return {
      pendingPlayerName: '',
      step: 10,
      finishLine: {
        enabled: false,
        value: 50,
      },
    };
  },
  methods: {
    focusFinishLineField(): void {
      (this.$refs.finishLineField as HTMLInputElement).focus();
    },
  }
};
</script>
