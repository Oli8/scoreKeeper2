<template>
  <div class="container">
    <game-form/>
    <game-quick-score
      @quick-score="onQuickScore"
      v-if="quickScoreOptions"
      :options="quickScoreOptions"
    />
  </div>
</template>

<script lang="ts">
import GameForm from '@/components/game/GameForm';
import GameQuickScore from '@/components/game/GameQuickScore';

export default {
  name: 'Game',
  components: {
    GameForm,
    GameQuickScore,
  },
  data() {
    return {
      quickScoreOptions: [...Array(11).keys()],
    };
  },
  methods: {
    onQuickScore(points: number): void {
      // TODO: update current player points
      console.log("update score", points)
    },
  },
};
</script>

<style lang="scss" scoped>
.container > * {
  margin: 20px 0;
}
</style>
