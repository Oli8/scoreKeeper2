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
    <game-logs
      :players="playersNames()"/>
  </div>
</template>

<script lang="ts">
import {
  uniqueNamesGenerator, Config,
  colors, adjectives, animals, starWars,
} from 'unique-names-generator';
import { range, sample, map } from 'lodash';

import GameForm from '@/components/game/GameForm';
import GameQuickScore from '@/components/game/GameQuickScore';
import PlayerTable from '@/components/game/PlayerTable';
import GameLogs from '@/components/game/GameLogs';

import Player from '@/structs/player.class';
import { DEFAULT_STEP } from '@/consts.ts';

export default {
  name: 'Game',
  components: {
    GameForm,
    GameQuickScore,
    PlayerTable,
    GameLogs,
  },
  mounted() {
    if (localStorage.players) {
      this.players = JSON.parse(localStorage.players).map((player) => {
        return new Player(player.name).setScore(player.score);
      });
    }
  },
  data() {
    return {
      players: [
        new Player("Jér"),
        new Player('Oli'),
        new Player('Sym'),
        new Player('Xav'),
      ] as Player[],
      step: DEFAULT_STEP,
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
      if (!this.isInvalidPlayerName(name))
        return name;

      do {
        const dictionary = sample([[adjectives, animals],
                                    [colors, animals],
                                    [starWars],]);
        name = uniqueNamesGenerator({dictionaries: dictionary,
                                      separator: ' ',
                                      length: dictionary.length,
                                    } as Config);
      } while (this.isInvalidPlayerName(name));

      return name;
    },
    isInvalidPlayerName(name: string): boolean {
      return !name.trim() || this.playersNames().includes(name);
    },
    playersNames(): string[] {
      return map(this.players, 'name');
    },
  },
  watch: {
    players: {
      handler: (val: Player[]) => {
        localStorage.players = JSON.stringify(val);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.container > * {
  margin: 20px 0;
}
</style>
