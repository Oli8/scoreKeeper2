<template>
  <section>
    <b-table
      :data="players"
      :striped="true">
      <template slot-scope="props">
        <b-table-column label="Rank" width="40" numeric>
          1st
        </b-table-column>

        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column label="Score" centered>
          <span class="tag is-primary">
            {{ props.row.score }}
          </span>
        </b-table-column>

        <b-table-column label="Add">
          <b-button icon-left="plus-circle"
                    type="is-primary"
                    @click="props.row.addPoints(step)"></b-button>
        </b-table-column>

        <b-table-column label="Substract">
          <b-button icon-left="minus-circle"
                    type="is-primary"
                    @click="props.row.addPoints(-step)"></b-button>
        </b-table-column>

        <b-table-column label="Reset">
          <b-button icon-left="redo"
                    type="is-primary"
                    @click="props.row.resetScore()"></b-button>
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

export default {
  props: {
    players: Array as () => Player[],
    step: Number,
  },
  methods: {
    removePlayer(player: Player): void {
      const index = this.players.findIndex(p => p === player);
      this.players.splice(index, 1);
      this.$emit('sync', 'players', this.players);
      this.$buefy.toast.open({
        message: `${player.name} has been removed from the game.`,
        type: 'is-info'
      })
    },
  },
}
</script>

<style lang="scss">
@import "@/variables";
/* /!\ Can't use `scoped` because of the nested components
   with their own `template` tag */
.table.is-striped tbody tr:not(.is-selected):nth-child(even) {
  background-color: $stripes;
}
</style>