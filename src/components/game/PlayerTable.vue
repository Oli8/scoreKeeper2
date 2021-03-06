<template>
  <section>
    <b-table
      :data="players"
      ref="table"
      :striped="true"
      :hoverable="true"
      :selected.sync="selected"
      :mobile-cards="false"
      detailed
      :show-detail-icon="false"
      focusable>
      <template slot-scope="props">
        <b-table-column label=""
                        class="is-hidden-tablet"
                        header-class="is-hidden-tablet">
          <b-icon icon="caret-down"
                  @click.native="toggle(props.row)"/>
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

        <b-table-column label="Score" centered>
          <span class="tag is-primary">
            {{ props.row.score }}
          </span>
        </b-table-column>

        <b-table-column label="Add" header-class="is-hidden-mobile">
          <b-button icon-left="plus-circle"
                    type="is-primary"
                    @click="addPoints(props.row, step)" />
        </b-table-column>

        <b-table-column label="Substract" header-class="is-hidden-mobile">
          <b-button icon-left="minus-circle"
                    type="is-primary"
                    @click="addPoints(props.row, -step)" />
        </b-table-column>

        <b-table-column label="Reset" header-class="is-hidden-mobile"
                        class="is-hidden-mobile">
          <reset-btn :onClick="resetPlayerScore.bind(this, props.row)"
                     :disabled="props.row.score === 0" />
        </b-table-column>

          <b-table-column label="Remove" header-class="is-hidden-mobile"
                          class="is-hidden-mobile">
            <remove-player-btn :onClick="$buefy.dialog.confirm.bind(this, {
              message: `Are you sure you want to remove ${props.row.name} from the game ?`,
              onConfirm: removePlayer.bind(this, props.row)
            })" />
        </b-table-column>
      </template>

      <template #detail="props">
        <div class="details">
            <reset-btn :onClick="resetPlayerScore.bind(this, props.row)"
                       :disabled="props.row.score === 0" />
            <remove-player-btn :onClick="$buefy.dialog.confirm.bind(this, {
              message: `Are you sure you want to remove ${props.row.name} from the game ?`,
              onConfirm: removePlayer.bind(this, props.row)
            })" />
        </div>
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
import Vue, { VNode } from 'vue';

import Player from '@/structs/player.class';
import EventsType from '@/structs/events';
import tableMixin from '@/mixins/table';

import { debounce, memoize } from 'lodash';

function memoizeDebounce(func: (...args: any) => any, wait=0, options={}) {
  const mem = memoize((param) => debounce(func, wait, options));
  return (param: any) => mem(param)(param);
}

const ResetBtn = Vue.extend({
  props: {
    onClick: Function,
  },
  render: function (createElement): VNode {
    return createElement('b-button', {
      props: {
        'icon-left': 'redo',
        type: 'is-primary',
      },
      on: {
        click: this.onClick
      },
    })
  },
});

const RemovePlayerBtn = Vue.extend({
  props: {
    onClick: Function,
  },
  render: function (createElement): VNode {
    return createElement('b-button', {
      props: {
        'icon-left': 'trash-alt',
        type: 'is-danger',
      },
      on: {
        click: this.onClick
      },
    })
  },
});

export default tableMixin.extend({
  name: 'PlayerTable',
  components: { ResetBtn, RemovePlayerBtn },
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
  created() {
    (this as any).deboucedAfterPlay = memoizeDebounce(
      this.$emit.bind(this, 'after-play'), 1500);
  },
  methods: {
    toggle(player: Player) {
      (this.$refs.table as any).toggleDetails(player);
    },
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

.details > button {
  margin-right: 1rem;
}
</style>