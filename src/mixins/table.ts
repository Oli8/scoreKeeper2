import Player from '@/structs/player.class';

export default {
  props: {
    players: Array as () => Player[],
  },
  methods: {
    getPlayerRank(player: Player): number {
      return this.players.filter((p: Player) => {
        return p.score > player.score;
      }).length + 1;
    },
  },
}
