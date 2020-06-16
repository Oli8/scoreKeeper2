<template>
  <div>
    <b-field label="Add a player">
      <b-input v-model="pendingPlayerName"
               v-on:keydown.native.enter="addPlayer"
               placeholder="Name"></b-input>
    </b-field>
    <b-field label="Step">
      <b-numberinput @input="updateStep"
                     min="0"
                     :value="step"></b-numberinput>
    </b-field>
    <div class="field basic-margin">
      <b-checkbox :value="finishLine.enabled"
                  @input="toggleFinishLine"
      >Finish line</b-checkbox>
      <div v-show="finishLine.enabled">
        <b-numberinput :value="finishLine.value"
                       @input="updateFinishLineValue"
                       ref="finishLineField">
        </b-numberinput>
        <b-checkbox class="basic-margin"
                    :value="finishLine.mustMatch"
                    @input="toggleFinishLineMustMatch"
        >Must match</b-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import FinishLine from '../../structs/finishLine';

export default Vue.extend({
  name: 'GameForm',
  props: {
    finishLine: Object as PropType<FinishLine>,
    step: Number,
  },
  data() {
    return {
      pendingPlayerName: '',
    };
  },
  methods: {
    toggleFinishLine(newVal: boolean): void {
      (this.$refs.finishLineField as HTMLInputElement).focus();
      this.updateFinishLine('enabled', newVal);
    },
    toggleFinishLineMustMatch(newVal: boolean): void {
      this.updateFinishLine('mustMatch', newVal);
    },
    addPlayer(): void {
      this.$emit('add-player', this.pendingPlayerName);
      this.pendingPlayerName = '';
    },
    updateFinishLineValue(newVal: number): void {
      this.updateFinishLine('value', newVal);
    },
    updateFinishLine(key: string, value: any): void {
      this.$emit('sync', ['options', 'finishLine', key], value);
    },
    updateStep(newVal: number) {
      this.$emit('sync', ['options', 'step'], newVal);
    },
  },
});
</script>
