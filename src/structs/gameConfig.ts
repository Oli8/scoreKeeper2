import { Component } from 'vue';

import FinishLine from './finishLine';
import Player from './player.class';
import AppComponent from '@/structs/AppComponent';

export default interface GameConfig {
  step: number;
  finishLine: FinishLine;
  quickScoreOptions?: number[];
  turn?: boolean;
  afterPlay?: (component: AppComponent,
               player: Player,
               points?: number) => void;
  afterTurn?: (turn: number) => void;
  sayScore?: 'TURN' | 'NEVER';
}