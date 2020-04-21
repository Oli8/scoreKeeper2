<template>
  <div class="container">
    <game-form
      @sync="SyncData"
      @add-player="addPlayer"/>
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
import {
  uniqueNamesGenerator, Config,
  colors, adjectives, animals, starWars,
} from 'unique-names-generator';
import { range, sample } from 'lodash';

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
      quickScoreOptions: range(13) as number[],
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
    addPlayer(name: string) {
      this.players.push(
        new Player(this.checkPlayerName(name)),
      );
    },
    checkPlayerName(name: string): string {
      if (this.isInvalidPlayerName(name)) {
        const dictionary = sample([[adjectives, animals],
                                   [colors, animals],
                                   [starWars],]);
        return uniqueNamesGenerator({dictionaries: dictionary,
                                     separator: ' ',
                                     length: dictionary.length,
                                    } as Config);
      }
      return name;
    },
    isInvalidPlayerName(name: string): boolean {
      return !name.trim() || this.players.map((p: Player) => p.name).includes(name);
    },
  },
};
</script>

<style lang="scss" scoped>
.container > * {
  margin: 20px 0;
}
</style>
