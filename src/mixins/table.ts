import Vue, { PropType } from 'vue';
import Player from '@/structs/player.class';

export default Vue.extend({
  props: {
    players: Array as PropType<Player[]>,
  },
  methods: {
    getPlayerRank(player: Player): number {
      return this.players.filter((p: Player) => {
        return p.score > player.score;
      }).length + 1;
    },
  },
});
