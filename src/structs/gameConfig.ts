import FinishLine from './finishLine';
import Player from './player.class';

export default interface GameConfig {
  step: number;
  finishLine: FinishLine;
  quickScoreOptions?: number[];
  turn?: boolean;
  afterPlay?: (player: Player, points: number) => void;
  afterTurn?: (turn: number) => void;
  sayScore?: 'TURN' | 'NEVER';
}