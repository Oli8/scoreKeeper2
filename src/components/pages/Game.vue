<template>
  <div class="container">
    <game-form @sync="SyncData"/>
    <game-quick-score
      v-if="quickScoreOptions"
      @quick-score="onQuickScore"
      :options="quickScoreOptions"/>
    <player-table
      @sync="SyncData"
      :players="players"
      :step="step"/>
  </div>
</template>

<script lang="ts">
import GameForm from '@/components/game/GameForm';
import GameQuickScore from '@/components/game/GameQuickScore';
import PlayerTable from '@/components/game/PlayerTable';
import Player from '@/structs/player.class';

export default {
  name: 'Game',
  components: {
    GameForm,
    GameQuickScore,
    PlayerTable,
  },
  data() {
    return {
      players: [
        new Player("Jér"),
        new Player('Oli'),
        new Player('Sym'),
        new Player('Xav'),
      ],
      step: 10,
      quickScoreOptions: [...Array(11).keys()] as number[],
    };
  },
  methods: {
    onQuickScore(points: number): void {
      // TODO: update current player points
      console.log("update score", points)
    },
    SyncData(property: string, value: any): any {
      this[property] = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.container > * {
  margin: 20px 0;
}
</style>
