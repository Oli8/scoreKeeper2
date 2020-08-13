<template>
  <div>
    <game-form
      :finish-line="options.finishLine"
      :step="options.step"
      @sync="SyncData"
      @add-player="addPlayer"/>
    <game-quick-score
      v-if="options.quickScoreOptions"
      @quick-score="onQuickScore"
      :options="options.quickScoreOptions"/>
    <player-table
      @sync="SyncData"
      :players="players"
      :current-player="currentPlayer"
      :step="options.step"/>
    <section class="basic-margin buttons is-centered">
      <b-button v-for="button in gameButtons"
                @click="$buefy.dialog.confirm({
                  message: 'Are you sure ?',
                  onConfirm: button.callback,
                })"
                :disabled="button.disabled()"
                :icon-left="button.icon"
                :key="button.label">
        {{ button.label }}
      </b-button>
      <b-button outlined
                type="is-info"
                @click="sayScores"
                :disabled="hasNoPlayers()"
                icon-left="bullhorn">
        Scores
      </b-button>
    </section>
    <game-logs :players="playersNames()"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  uniqueNamesGenerator, Config,
  colors, adjectives, animals, starWars,
} from 'unique-names-generator';
import { range, sample, map, set, max, sortBy } from 'lodash';

import GameForm from '@/components/game/GameForm.vue';
import GameQuickScore from '@/components/game/GameQuickScore.vue';
import PlayerTable from '@/components/game/PlayerTable.vue';
import GameLogs from '@/components/game/GameLogs.vue';

import DefaultOptions from '@/game-configs/default';
import Player from '@/structs/player.class';
import gameButton from '@/structs/gameButton';
import EventsType from '@/structs/events';
import { WatchAndCache } from '@/utils';
import GameConfig from '../../structs/gameConfig';

const synth = window.speechSynthesis;

export default Vue.extend({
  name: 'Game',
  components: {
    GameForm,
    GameQuickScore,
    PlayerTable,
    GameLogs,
  },
  mounted() {
    this.loadPlayers();
    this.loadConfig();
  },
  data() {
    return {
      options: DefaultOptions as GameConfig,
      players: [] as Player[],
      currentPlayer_: null,
    };
  },
  computed: {
    gameButtons(): gameButton[] {
      return [
        { label: 'Reset Scores', callback: this.resetScores,
          disabled: this.areAllScoresAtZero, icon: 'redo' },
        { label: 'Clear game', callback: this.clearGame,
          disabled: this.hasNoPlayers, icon: 'trash' },
        { label: 'End game', callback: this.endGame,
          disabled: this.hasNoPlayers, icon: 'step-forward' },
      ];
    },
    currentPlayer: {
      get(): Player|null {
        if (this.hasNoPlayers())
          return null;

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
    async loadConfig() {
      const configName = this.$route.params.config;
      if (!configName)
        return;

      try {
        const { default: config } =
          await import(`@/game-configs/${configName}`);
        this.options = config;
      } catch (_e) {
        this.$router.push({
          name: 'Game',
        });
      }
    },
    loadPlayers(): void {
      if (!localStorage.players)
        return;

      this.players = JSON.parse(localStorage.players).map((player: Player) => {
        return new Player(player.name, player.indicators)
                .setScore(player.score);
      });
    },
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
      this.$router.push(({
        name: 'Result',
        params: {
          players: this.players,
        },
      }) as any);
    },
    sayScores(): void {
      sortBy(this.players, (player: Player) => -player.score)
        .forEach((player: Player) => {
          // use '!' for longer pause between name and score
          synth.speak(new SpeechSynthesisUtterance(`${player.name}! ${player.score}.`));
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
      if (!this.options.finishLine.enabled)
        return;

      if (
        (this.options.finishLine.mustMatch && newScores.includes(this.options.finishLine.value))
         || (max(newScores) >= this.options.finishLine.value && !this.options.finishLine.mustMatch)) {
            this.endGame();
      }
    },
    ...WatchAndCache('players'),
  },
  beforeRouteEnter(_to, from, next) {
    next((vm: any) => {
      if (from.name === 'Result') {
        vm.resetScores({withEvent: false});
      }
    });
  },
});
</script>

<style lang="scss" scoped>
.container > * {
  margin: 20px 0;
}
</style>
