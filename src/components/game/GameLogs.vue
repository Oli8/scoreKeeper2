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

interface eventData {
  player?: string,
  points?: number,
  turn?: number,
}

interface event {
  type: EventsType,
  data?: eventData,
}

const eventMessage = {
  [EventsType.POINTS]: (e: eventData): string => `${e.player} has won ${e.points} points`,
  [EventsType.SCORE_RESET]: (e: eventData): string => `${e.player}'s score has been reset`,
  [EventsType.GAME_RESET]: (e: eventData): string => 'Game has been reset',
  [EventsType.NEW_TURN]: (e: eventData): string => `Turn: ${e.turn}`,
  [EventsType.PLAYER_REMOVED]: (e: eventData): string => `${e.player} has been removed`,
};

export default {
  name: 'GameLogs',
  props: {
    players: Array as () => string[],
  },
  data() {
    return {
      events: [
        { type: EventsType.POINTS, data: { player: 'Olivier', points: 7 }},
        { type: EventsType.GAME_RESET },
        { type: EventsType.NEW_TURN, data: { turn: 1 }},
        { type: EventsType.SCORE_RESET, data: { player: 'Jer' }},
        { type: EventsType.PLAYER_REMOVED, data: { player: 'Jer' }},
      ] as event[],
      filterPlayer: '',
    };
  },
  methods: {
    formatMessage(event: event): string {
      return eventMessage[event.type](event.data as eventData);
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
