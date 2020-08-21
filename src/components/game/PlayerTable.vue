<template>
  <section>
    <b-table
      :data="players"
      :striped="true"
      :hoverable="true"
      :selected.sync="selected"
      focusable>
      <template slot-scope="props">
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

        <b-table-column label="Score" centered>
          <span class="tag is-primary">
            {{ props.row.score }}
          </span>
        </b-table-column>

        <b-table-column label="Add">
          <b-button icon-left="plus-circle"
                    type="is-primary"
                    @click="addPoints(props.row, step)"></b-button>
        </b-table-column>

        <b-table-column label="Substract">
          <b-button icon-left="minus-circle"
                    type="is-primary"
                    @click="addPoints(props.row, -step)"></b-button>
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
    addPoints(player: Player, points: number): void {
      player.addPoints(points);

      // method not detected as created in created()
      (this as any).deboucedAfterPlay(player);

      this.emitLogEvent({
        type: EventsType.POINTS,
        data: { player: player.name, points: points }
      });
    },
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
</style>