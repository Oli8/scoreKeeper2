import GameConfig from '@/structs/gameConfig';
import Player from '@/structs/player.class';

import { range, get } from 'lodash';

const missedIndicator = 'times-circle';

/*
- Add indicator when player gets a zero

- Get player score to zero if it gets zero three times in a row
  So if he gets three indicators of missed

- Get player's score back to 25 if his score goes above 50
*/
const MolkyOptions: GameConfig = {
  step: 1,
  finishLine: {
    enabled: true,
    value: 50,
    mustMatch: true,
  },
  quickScoreOptions: range(13),
  afterPlay(player: Player, points?) {
    if (points === 0) {
      player.addIndicator(missedIndicator);
    } else {
      player.resetIndicator(missedIndicator);
    }

    // Three missed in a row
    if (get(player, ['indicators', 'times-circle'], 0) === 3) {
      player.resetScore();
      player.resetIndicator(missedIndicator);
    }

    if (player.score > 50) {
      player.setScore(25);
      // emitLogEvent({
      //   type: 'CUSTOM',
      //   message: `${player.name} went back to 25 !`,
      // });
    }
  },
};

export default MolkyOptions;
