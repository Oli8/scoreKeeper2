<template>
  <div>
    <game-form
      :finish-line="finishLine"
      @sync="SyncData"
      @add-player="addPlayer"/>
    <game-quick-score
      v-if="quickScoreOptions"
      @quick-score="onQuickScore"
      :options="quickScoreOptions"/>
    <player-table
      @sync="SyncData"
      :players="players"
      :current-player="currentPlayer"
      :step="step"/>
    <section class="buttons is-centered">
      <b-button v-for="button in gameButtons"
                @click="$buefy.dialog.confirm({
                  message: 'Are you sure ?',
                  onConfirm: button.callback,
                })"
                :disabled="button.disabled()"
                :icon-left="button.icon">
        {{ button.label }}
      </b-button>
    </section>
    <game-logs :players="playersNames()"/>
  </div>
</template>

<script lang="ts">
import {
  uniqueNamesGenerator, Config,
  colors, adjectives, animals, starWars,
} from 'unique-names-generator';
import { range, sample, map, set, max } from 'lodash';

import GameForm from '@/components/game/GameForm';
import GameQuickScore from '@/components/game/GameQuickScore';
import PlayerTable from '@/components/game/PlayerTable';
import GameLogs from '@/components/game/GameLogs';

import Player from '@/structs/player.class';
import gameButton from '@/structs/gameButton';
import { DEFAULT_STEP } from '@/consts.ts';
import EventsType from '@/structs/events';
import finishLine from '@/structs/finishLine';
import { WatchAndCache } from '@/utils';

export default {
  name: 'Game',
  components: {
    GameForm,
    GameQuickScore,
    PlayerTable,
    GameLogs,
  },
  mounted() {
    // Load players from Storage
    if (localStorage.players) {
      this.players = JSON.parse(localStorage.players).map((player) => {
        return new Player(player.name).setScore(player.score);
      });
    }
  },
  data() {
    return {
      players: [] as Player[],
      step: DEFAULT_STEP,
      finishLine: {
        enabled: false,
        value: 50,
      } as finishLine,
      quickScoreOptions: range(13) as number[],
      gameButtons: [
        { label: 'Reset Scores', callback: this.resetScores,
          disabled: this.areAllScoresAtZero, icon: 'redo' },
        { label: 'Clear game', callback: this.clearGame,
          disabled: this.hasNoPlayers, icon: 'trash' },
        { label: 'End game', callback: this.endGame,
          disabled: this.hasNoPlayers, icon: 'step-forward' },
      ] as gameButton[],
      currentPlayer_: null,
    };
  },
  computed: {
    currentPlayer: {
      get(): Player {
        if (this.hasNoPlayers())
          return;

        return this.currentPlayer_ || this.players[0];
      },
      set(player: Player) {
        this.currentPlayer_ = player;
      },
    },
    scores(): number[] {
      return map(this.players, 'score');
    },
  },
  methods: {
    onQuickScore(points: number): void {
      this.currentPlayer.addPoints(points);
      this.emitLogEvent({
        type: EventsType.POINTS,
        data: { player: this.currentPlayer.name, points }
      });
      this.nextPlay();
    },
    nextPlay(): void {
      const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
      this.currentPlayer = this.players[(currentPlayerIndex + 1) % this.players.length];
    },
    SyncData(property: string|string[], value: any): any {
      set(this, property, value);
    },
    addPlayer(name: string) {
      name = this.checkPlayerName(name);
      this.players.push(
        new Player(this.checkPlayerName(name)),
      );
      this.emitLogEvent({
        type: EventsType.PLAYER_JOINED,
        data: { player: name }
      });
    },
    resetScores({withEvent=true}): void {
      this.players.forEach((p: Player) => p.resetScore());
      if (withEvent)
        this.emitLogEvent({ type: EventsType.SCORES_RESET });
    },
    clearGame(): void {
      this.players = [];
      this.$root.$emit('game-cleared');
    },
    endGame(): void {
      this.$router.push({
        name: 'Result',
        params: {
          players: this.players,
        },
      });
    },
    areAllScoresAtZero(): boolean {
      return this.players.every((p: Player) => p.score === 0);
    },
    hasNoPlayers(): boolean {
      return this.players.length === 0;
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
    scores(newScores) {
      if (!this.finishLine.enabled)
        return;

      if (max(newScores) >= this.finishLine.value)
        this.endGame();
    },
    ...WatchAndCache('players')
  },
  beforeRouteEnter(_to, from, next) {
    next(vm => {
      if (from.name === 'Result')
        vm.resetScores({withEvent: false});
    });
  },
};
</script>

<style lang="scss" scoped>
.container > * {
  margin: 20px 0;
}
</style>
