<template>
  <div>
    <h1>Logs</h1>
    <b-select placeholder="Select a name"
              class="has-text-centered"
              v-model="filterPlayer">
      <option value="" selected>All</option>
      <option
        v-for="player in players"
        :value="player">
        {{ player }}
      </option>
    </b-select>
    <ul>
      <li v-for="event in [...filteredHistory].reverse()">
        {{ formatMessage(event) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import EventsType from '@/structs/events';
import { event, eventData } from '@/structs/logEvents';
import { WatchAndCache } from '@/utils';

const eventMessage = {
  [EventsType.POINTS]: (e: eventData): string => `${e.player} has ${e.points < 0 ? 'lost' : 'won'}
                                                  ${Math.abs(e.points)} points`,
  [EventsType.SCORE_RESET]: (e: eventData): string => `${e.player}'s score has been reset`,
  [EventsType.SCORES_RESET]: (e: eventData): string => `Scores have been reset`,
  [EventsType.GAME_RESET]: (e: eventData): string => 'Game has been reset',
  [EventsType.NEW_TURN]: (e: eventData): string => `Turn: ${e.turn}`,
  [EventsType.PLAYER_REMOVED]: (e: eventData): string => `${e.player} has been removed`,
  [EventsType.PLAYER_JOINED]: (e: eventData): string => `${e.player} has joined the game!`,
};

export default {
  name: 'GameLogs',
  props: {
    players: Array as () => string[],
  },
  mounted() {
    this.$root.$on('log-event', (event: eventData) => {
      this.events.push(event);
    });

    this.$root.$on('game-cleared', () => {
      this.events = [];
    });

    this.loadEventsFromStorage();
  },
  data() {
    return {
      events: [] as event[],
      filterPlayer: '',
    };
  },
  methods: {
    formatMessage(event: event): string {
      return eventMessage[event.type](event.data as eventData);
    },
    loadEventsFromStorage() {
      const events = localStorage.events;
      if (events)
        this.events = JSON.parse(events);
    },
  },
  computed: {
    filteredHistory() {
      if (!this.filterPlayer)
        return this.events;

      return this.events.filter((event: event) => {
        return event?.data?.player === this.filterPlayer;
      });
    },
  },
  watch: WatchAndCache('events'),
};
</script>

<style lang="scss" scoped>
@import "~buefy/src/scss/buefy-build.scss";
@import "@/variables";

h1 {
  border-bottom: 1px solid $primary;
}

li:nth-child(even) {
  background: $stripes;
}
</style>
