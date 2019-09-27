import {Card} from './card';
// @ts-ignore
import * as Handlebars from 'handlebars';

interface Level {
  rows: number;
  cols: number;
  score: number;
}

interface CardConfig {
  levels: Level[];
}

export class Croupier {
  cardsConfig: CardConfig; // later specify this in
  card1Picked: Card;
  card2Picked: Card;
  totalCards: number;
  cards: Card[];
  maxScore: number;
  sqrtSpace = 2700; // area space in vmin where the cards can be placed
  levelElements: NodeListOf<HTMLInputElement>;
  backgroundTypeElements:  NodeListOf<HTMLInputElement>;
  scoreElement: Element;
  boardElement: HTMLElement;
  currentLevel: number;
  currentGame: number;
  totalScore: number;

  /**
   * Shuffles array in place
   * @param {Array} cards items
   */
  private static shuffleCards(cards:Card[]): Card[] {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
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
   * returns a new card with initial properties
   * @param faceID
   */
  private static getNewCard(faceID:number): Card {
    return new Card(faceID);
  }


  constructor() {
    this.levelElements = document.querySelectorAll('.levels input');
    this.backgroundTypeElements = document.querySelectorAll('.type input');
    this.scoreElement = document.getElementsByClassName('score')[0];
    this.boardElement = document.getElementById('board');

    this.init();
  };

  /**
   * initialise the game
   */
  private init(): void {
    this.cardsConfig = {
      levels: [
        {rows: 2, cols: 2, score: 0},
        {rows: 2, cols: 3, score: 0},
        {rows: 3, cols: 4, score: 0},
        {rows: 4, cols: 4, score: 0},
        {rows: 4, cols: 5, score: 0},
        {rows: 4, cols: 6, score: 0},
        {rows: 5, cols: 6, score: 0},
      ]
    };

    this.levelElements.forEach(el => {
      el.addEventListener('change', evt => {
        const level = (<HTMLInputElement>evt.target).value;
        this.startGame(Number(level));
      })
    });

    this.backgroundTypeElements.forEach(el => {
      el.addEventListener('change', evt => {
        const type = (<HTMLInputElement>evt.target).value;
        const action = type === 'faces' ? 'add' : 'remove';
        this.boardElement.classList[action]('faces');
      })
    });

    this.currentLevel = 0;
  };

  /**
   * reset all to start position
   * @param {number} gameIndex
   */
  private resetGame(gameIndex: number): void{
    this.card1Picked = null;
    this.card2Picked = null;
    this.totalCards = 0;
    this.cards = [];
    this.currentGame = gameIndex;
    const board   = document.getElementById("board");
    document.getElementsByClassName('score')[0].classList.remove('show');

    board.innerHTML = '';

    this.setLevels(gameIndex);
  }

  /**
   * draw a number/2 cards twice
   * @param totalCards
   */
  private drawCards(totalCards: number): void{
    let i;
    for(i = 1; i <= totalCards/2; i++){
      const firstCard = Croupier.getNewCard(i);
      const secondCard = Croupier.getNewCard(i);
      this.cards.push(firstCard);
      this.cards.push(secondCard);
    }
    Croupier.shuffleCards(this.cards);

    this.cards.forEach((card, index) => {
      this.createCardElement(card, index);
    });
  }

  /**
   * compiles the handlebars template and creates the card in dom with eventhandlers
   * @param card
   * @param index
   */
  private createCardElement(card:Card, index:number) {
    const board   = document.getElementById("board");
    const source   = document.getElementById("card-template").innerHTML;

    // compile handlebars template
    const template = Handlebars.compile(source);
    const html =  template({card,index});

    // create HTMLNodesfragment
    let frag = document.createRange().createContextualFragment(html);
    let button = frag.querySelector('button');

    // add click handler
    button.addEventListener('click', () => {
      this.handleCardTurn(card);
    });

    // append to board
    board.appendChild(frag);

    // add element reference to the card
    card.element = document.getElementById(`card-${index}`);
  }

  /**
   * reset the input settings
   * @param {Number} gameIndex
   */
  private setLevels(gameIndex: Number){
    this.levelElements.forEach((el, index) => {
      el.checked =  index === gameIndex;
      el.disabled = index > this.currentLevel;
    });
  }

  /**
   * handle card turning
   */
  private handleCardTurn(card:Card):void {
    if (card.faceUp || card.matched) {
      return;
    }
    if (!this.card1Picked) {
      card.show();
      this.card1Picked = card;
    } else if (!this.card2Picked) {
      card.show();
      this.card2Picked = card;
      const isMatched = this.card1Picked.isMatchedWith(this.card2Picked);
      this.maxScore = Math.max(100, this.maxScore - 20);
      if(isMatched){
        this.handleMatchCards();
      }
      setTimeout(() => {this.resetTurnedCards(isMatched)}, 1000);
    } else {
      // clicked third card when still cards are not reset
      return
    }
  }

  /**
   * turnback not matched cards and reset the selected cards
   * @param matched
   */
  private resetTurnedCards(matched: boolean){
    if(!matched){
      this.card1Picked.hide();
      this.card2Picked.hide();
    }
    this.card1Picked = null;
    this.card2Picked = null;
  }

  /**
   * check if both cards are a matched and handle the matching
   */
  private handleMatchCards(){
    this.card1Picked.setMatched();
    this.card2Picked.setMatched();

    if(this.checkAllMatched()){
      this.finalizedGame();
    }
  }

  /**
   * test if all cards have a match
   */
  private checkAllMatched():boolean {
    return this.cards.every( (card:Card):boolean => {
      return card.matched;
    });
  }

  private finalizedGame(){
    console.log('hooraa');
    // store score
    this.cardsConfig.levels[this.currentGame].score = this.maxScore;
    const totalScore = this.cardsConfig.levels.map(Croupier.amount).reduce(Croupier.sum);

    // display score
    document.getElementsByClassName('score')[0].classList.add('show');
    document.getElementById('total-score').innerText = totalScore.toString();

    // if current game is the highest then set level 1 higher
    if(this.currentGame === this.currentLevel){
      this.currentLevel++;
    }

    // enable the levels
    this.setLevels(this.currentGame);
  }

  /**
   * start the game with a specific level -  more levels later default is 6
   * @param levelIndex
   */
  public startGame(levelIndex:number = 0): void {
    let root = document.documentElement;
    let level = this.cardsConfig.levels[levelIndex];

    console.log(`starting! level ${levelIndex}`,  this.cardsConfig.levels);

    const totalCards = level.rows * level.cols;
    const sqrt = Math.sqrt(this.sqrtSpace / totalCards);

    root.style.setProperty('--square-root', `${sqrt}vmin`);
    root.style.setProperty('--repeat-columns', level.cols.toString());
    root.style.setProperty('--repeat-rows', level.rows.toString());

    this.maxScore = 50 * totalCards;

    this.resetGame(levelIndex);
    this.drawCards(totalCards);
  };

}
