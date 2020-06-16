<template>

  <section>
  <b-message v-if="draggable" title="Info" type="is-primary" aria-close-label="Close message">
    Drag the players up and down to change the order!
  </b-message>
    <b-table
      :data="players"
      :striped="true"
      :hoverable="true"
      :selected.sync="selected"
      focusable
      :draggable="draggable"
      @dragstart="dragstart"
      @drop="drop"
      @dragover="dragover"
      @dragleave="dragleave">
      <template slot-scope="props">
        <b-table-column width="40" :visible="draggable">
           <b-icon
                icon="grip-vertical"
                size="is-small"
                class="handle">
            </b-icon>
        </b-table-column>

        <b-table-column label="Rank" width="40" numeric>
          {{ getPlayerRank(props.row) }}
        </b-table-column>

        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column>
          <template v-for="(count, icon) in props.row.indicators">
            <template v-for="i in count">
              <b-icon :icon="icon" :key="icon+i"></b-icon>
            </template>
          </template>
        </b-table-column>

        <b-table-column label="Score" field="score" centered numeric>
          <span class="tag is-primary">
            {{ props.row.score }}
          </span>
        </b-table-column>

        <b-table-column label="Add">
          <b-button icon-left="plus-circle"
                    type="is-primary"
                    @click="addPoints(props.row)"></b-button>
        </b-table-column>

        <b-table-column label="Substract">
          <b-button icon-left="minus-circle"
                    type="is-primary"
                    @click="reducePoints(props.row)"></b-button>
        </b-table-column>

        <b-table-column label="Reset">
          <b-button icon-left="redo"
                    type="is-primary"
                    @click="resetPlayerScore(props.row)"></b-button>
        </b-table-column>

          <b-table-column label="Remove">
            <b-button icon-left="trash-alt"
                      type="is-danger"
                      @click="$buefy.dialog.confirm({
                          message: `Are you sure you want to remove ${props.row.name} from the game ?`,
                          onConfirm: removePlayer.bind(this, props.row)
                      })"></b-button>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                  icon="frown"
                  size="is-large">
              </b-icon>
            </p>
            <p>No players yet.</p>
          </div>
        </section>
      </template>

    </b-table>
  </section>
</template>

<script lang="ts">
import Player from '@/structs/player.class';
import EventsType from '@/structs/events';
import tableMixin from '@/mixins/table';

export default tableMixin.extend({
  name: 'PlayerTable',
  props: {
    step: Number,
    currentPlayer: Player,
  },
  computed: {
    selected: {
      get(): Player {
        return this.currentPlayer;
      },
      set(player: Player) {
        this.$emit('sync', 'currentPlayer', player);
      },
    },
    draggable: Boolean,
  },
  data() {
    return {
      draggingRow: false,
      draggingRowIndex: false,
    };
  },
  methods: {
    removePlayer(player: Player): void {
      const index = this.players.findIndex(p => p === player);
      this.players.splice(index, 1);

      this.sendRemovePlayerEvents(player);

      this.$buefy.toast.open({
        message: `${player.name} has been removed from the game.`,
        type: 'is-info'
      });
    },
    sendRemovePlayerEvents(player: Player): void {
      this.$emit('sync', 'players', this.players);
      this.emitLogEvent({
        type: EventsType.PLAYER_REMOVED,
        data: { player: player.name }
      });
    },
    resetPlayerScore(player: Player): void {
      player.resetScore();
      this.emitLogEvent({
        type: EventsType.SCORE_RESET,
        data: { player: player.name }
      });
    },
    addPoints(player: Player): void {
      player.addPoints(this.step);
      this.emitLogEvent({
        type: EventsType.POINTS,
        data: { player: player.name, points: this.step }
      });
    },
    reducePoints(player: Player): void {
      player.addPoints(-this.step);
      this.emitLogEvent({
        type: EventsType.POINTS,
        data: { player: player.name, points: -this.step }
      });
    },
    swapPlayers(index1: number, index2: number): void {
      [this.players[index1], this.players[index2]] = [this.players[index2], this.players[index1]];
      this.$forceUpdate();
    },
    dragstart (payload) {
      this.draggingRow = payload.row
      this.draggingRowIndex = payload.index
      payload.event.dataTransfer.effectAllowed = 'move'
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = 'move'
      payload.event.target.closest('tr').classList.add('is-selected')
      payload.event.preventDefault()
      if(this.draggingRowIndex !== payload.index) {
        this.swapPlayers(this.draggingRowIndex as number, payload.index);
        this.draggingRowIndex = payload.index // update dragged row index
      }
    },
    dragleave(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      payload.event.preventDefault()
    },
    drop(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
    }
  },
});
</script>

<style lang="scss">
@import "@/variables";
/* /!\ Can't use `scoped` because of the nested components
   with their own `template` tag */
.table.is-striped tbody tr:not(.is-selected):nth-child(even) {
  background-color: $stripes;
}

.table tr.is-selected {
  background-color: darken($purple, 5);
  color: white;
}

.handle{
  cursor: move; // fallback
  cursor: grab;
}
</style>
