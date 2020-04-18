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
                      type="is-primary"
                      @click="removePlayer(props.row)"></b-button>
        </b-table-column>
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
    },
  },
}
</script>
