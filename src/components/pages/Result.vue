<template>
  <div>
    <b-notification type="is-success" aria-close-label="Close notification">
     <b-icon icon="medal"></b-icon> {{ winnersMessage() }}
    </b-notification>

    <b-table
      :data="players"
      default-sort="score"
      default-sort-direction="desc"
      :striped="true">
      <template slot-scope="props">
        <b-table-column label="Rank" width="40" numeric>
          {{ getPlayerRank(props.row) }}
        </b-table-column>

        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column label="Score" centered field="score" sortable>
          <span class="tag is-primary">
            {{ props.row.score }}
          </span>
        </b-table-column>
      </template>
    </b-table>

    <section class="buttons is-centered">
      <b-button v-for="button in gameButtons"
                @click="button.callback"
                :icon-left="button.icon">
        {{ button.label }}
      </b-button>
    </section>
  </div>
</template>

<script lang="ts">
import { map, max, first } from 'lodash';

import gameButton from '@/structs/gameButton';
import Player from '@/structs/player.class';
import tableMixin from '@/mixins/table';

export default {
  name: 'Result',
  mixins: [tableMixin],
  data() {
    return {
      gameButtons: [
        { label: 'New Game', callback: this.newGame,
          disabled: () => false, icon: 'redo' },
        { label: 'Replay with the same players', callback: this.replay,
          disabled: () => false, icon: 'redo' },
      ] as gameButton[],
    };
  },
  methods: {
    winners(): Player[] {
      const maxScore = max(map(this.players, 'score'));

      return this.players.filter((p: Player) => {
        return p.score === maxScore;
      });
    },
    winnersMessage(): string {
      const winner: Player[] = map(this.winners(), 'name');

      if (winner.length === 1) {
        return `${first(winner)} has won!`;
      }
      const lastWinner = winner.pop();
      return `${winner.join(', ')} and ${lastWinner} have won!`;
    },
    newGame(): void {
      localStorage.removeItem('players');
      this.goToGame();
    },
    replay(): void {
      this.goToGame();
    },
    goToGame(): void {
      this.$router.push({
        name: 'Game',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.notification .icon {
  vertical-align: middle;
}
</style>