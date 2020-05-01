<template>
  <div>
    <b-field label="Add a player">
      <b-input v-model="pendingPlayerName"
               v-on:keydown.native.enter="addPlayer"
               placeholder="Name"></b-input>
    </b-field>
    <b-field label="Step">
      <b-numberinput @input="$emit('sync', 'step', Number(step))"
                     min="0"
                     v-model="step"></b-numberinput>
    </b-field>
    <div class="field">
      <b-checkbox v-model="finishLine.enabled"
                  @input="focusFinishLineField"
      >Finish line</b-checkbox>
      <b-numberinput v-model="finishLine.value"
               ref="finishLineField"
               v-show="finishLine.enabled"></b-numberinput>
    </div>
  </div>
</template>

<script lang="ts">
import { DEFAULT_STEP } from '@/consts.ts';

export default {
  name: 'GameForm',
  data() {
    return {
      pendingPlayerName: '',
      step: DEFAULT_STEP,
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
