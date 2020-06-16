import GameConfig from '@/structs/gameConfig';

import { range } from 'lodash';

const DefaultOptions: GameConfig = {
  step: 5,
  finishLine: {
    enabled: false,
  },
  quickScoreOptions: range(1, 11),
  sayScore: 'TURN',
};

export default DefaultOptions;
