export default class Player {
  readonly name: string;
  score: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  public resetScore(): void {
    this.score = 0;
  }

  public addPoints(points: number) {
    this.score += points;
  }

  public setScore(score: number) {
    this.score = score;
    return this;
  }
}
