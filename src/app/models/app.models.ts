export interface Letter {
    letter: String;
    yPos: number;
  }

export interface State {
    letters: Letter[];
    score: number;
    level: number;
}