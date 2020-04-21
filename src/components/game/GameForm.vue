<template>
  <div>
    <b-field label="Add a player">
      <b-input v-model="pendingPlayerName"
               v-on:keydown.native.enter="addPlayer"
               placeholder="Name"></b-input>
    </b-field>
    <b-field label="Step">
      <b-numberinput @input="$emit('sync', 'step', Number(step))"
                     v-model="step"></b-numberinput>
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
    addPlayer(): void {
      this.$emit('add-player', this.pendingPlayerName);
      this.pendingPlayerName = '';
    },
  },
};
</script>
