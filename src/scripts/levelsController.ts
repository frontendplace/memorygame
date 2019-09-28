import { Level } from '../models/level.model';

export class LevelsController {
  levels: Level[]; // later specify this in
  currentLevel: number;
  currentGame: number;
  levelElements: NodeListOf<HTMLInputElement>;
  scoreElement: HTMLElement;
  totalScoreElement: HTMLElement;
  totalScore: number;
  maxScore: number;

  constructor() {
    this.levelElements = document.querySelectorAll('.levels input');
    this.scoreElement = <HTMLElement>document.getElementsByClassName('score')[0];
    this.totalScoreElement = document.getElementById('total-score');
    this.init();
  };

  init() {
    this.levels = [
      {rows: 2, cols: 2, score: 0},
      {rows: 2, cols: 3, score: 0},
      {rows: 3, cols: 4, score: 0},
      {rows: 4, cols: 4, score: 0},
      {rows: 4, cols: 5, score: 0},
      {rows: 4, cols: 6, score: 0},
      {rows: 5, cols: 6, score: 0},
    ];

    this.currentLevel = 0;
    this.currentGame = 0;
  }

  /**
   * get score
   * @param {Level} item
   * @returns {number}
   * @example usage tot sum up all values: levels.map(amount).reduce(sum);
   */
  private static amount(item: Level): number{
    return item.score;
  }

  /**
   * sum two values
   * @param {number} prev
   * @param {number} next
   * @returns {number}
   */
  private static sum(prev:number, next:number): number{
    return prev + next;
  }

  /**
   * reset the input settings
   * @param {Number} gameIndex
   */
  public setLevels(gameIndex: Number){
    this.levelElements.forEach((el, index) => {
      el.checked =  index === gameIndex;
      el.disabled = index > this.currentLevel;
    });
  }

  /**
   * start the game with a specific level -  more levels later default is 6
   * @param levelIndex
   */
  public resetLevel(levelIndex:number = 0): Level {
    this.currentGame = levelIndex; // set in levels
    this.hideScore();
    this.setLevels(levelIndex);

    const level = this.levels[levelIndex];
    const totalCards = level.rows * level.cols;
    this.maxScore = 50 * totalCards;

    console.log(`starting! level ${levelIndex}`,  this.levels);

    return level;
  };

  /**
   * calculate the total score
   * @returns {number}
   */
  private getTotalScore(){
    return this.levels.map(LevelsController.amount).reduce(LevelsController.sum);
  }

  /**
   * finalize the current game, enable the next and show the scoreboard
   */
  public finalizeLevel(){
    // if current game is the highest then set level 1 higher
    if(this.currentGame === this.currentLevel){
      this.currentLevel++;
    }
    // enable the nextlevel
    this.setLevels(this.currentGame);
    this.showScore();
  }

  /**
   * hide the scoreboard
   */
  private hideScore(){
    this.scoreElement.classList.remove('show');
  }

  /**
   * show the scoreboard
   */
  private showScore(){
    this.totalScore = this.getTotalScore();
    this.scoreElement.classList.add('show');
    this.totalScoreElement.innerText = this.totalScore.toString();
  }
}
