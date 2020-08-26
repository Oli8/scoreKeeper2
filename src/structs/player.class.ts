export default class Player {
  readonly name: string;
  score: number = 0;
  indicators: Record<string, number> = {};

  constructor(name: string, indicators?: Record<string, number>) {
    this.name = name;
    if (indicators)
      this.indicators = indicators;
  }

  public resetScore(): Player {
    this.score = 0;
    return this;
  }

  public addPoints(points: number): Player {
    this.score += points;
    return this;
  }

  public setScore(score: number): Player {
    this.score = score;
    return this;
  }

  public addIndicator(type: string): Player {
    if (type in this.indicators) {
      this.updateIndicators(
        type,
        this.indicators[type] + 1,
      )
    } else {
      this.updateIndicators(
        type,
        1,
      );
    }

    return this;
  }

  public removeIndicator(type: string): Player {
    if (this.indicators[type] > 0) {
      this.updateIndicators(
        type,
        this.indicators[type] - 1,
      );
    }

    return this;
  }

  public resetIndicator(type: string): Player {
    this.updateIndicators(type, 0);

    return this;
  }

  private updateIndicators(type: string, value: number): void {
    // Use assignment to fire watcher
    this.indicators = {
      ...this.indicators,
      [type]: value,
    };
  }
}
