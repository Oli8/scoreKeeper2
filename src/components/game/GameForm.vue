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
    <div class="field basic-margin">
      <b-checkbox :value="this.finishLine.enabled"
                  @input="toggleFinishLine"
      >Finish line</b-checkbox>
      <template v-show="this.finishLine.enabled">
        <b-numberinput :value="this.finishLine.value"
                       @input="updateFinishLineValue"
                       ref="finishLineField">
        </b-numberinput>
        <b-checkbox class="basic-margin"
                    :value="this.finishLine.mustMatch"
                    @input="toggleFinishLineMustMatch"
        >Must match</b-checkbox>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { DEFAULT_STEP } from '@/consts.ts';
import finishLine from '../../structs/finishLine';

const finishLineSlug = 'finishLine';

export default Vue.extend({
  name: 'GameForm',
  props: {
    finishLine: Object as PropType<finishLine>,
  },
  data() {
    return {
      pendingPlayerName: '',
      step: DEFAULT_STEP,
    };
  },
  methods: {
    toggleFinishLine(newVal: boolean): void {
      (this.$refs.finishLineField as HTMLInputElement).focus();
      this.$emit('sync', [finishLineSlug, 'enabled'], newVal);
    },
    toggleFinishLineMustMatch(newVal: boolean): void {
      this.$emit('sync', [finishLineSlug, 'mustMatch'], newVal);
    },
    addPlayer(): void {
      this.$emit('add-player', this.pendingPlayerName);
      this.pendingPlayerName = '';
    },
    updateFinishLineValue(newVal: number): void {
      this.$emit('sync', [finishLineSlug, 'value'], newVal);
    },
  },
});
</script>
