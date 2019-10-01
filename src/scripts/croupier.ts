import {Card} from './card';
// @ts-ignore
import * as Handlebars from 'handlebars';
import { Level } from '../models/level.model';
import { LevelsController } from './levelsController';

export class Croupier {
  card1Picked: Card;
  card2Picked: Card;
  totalCards: number;
  cards: Card[];
  sqrtSpace = 2700; // area space in vmin where the cards can be placed
  levelElements: NodeListOf<HTMLInputElement>;
  backgroundTypeElements:  NodeListOf<HTMLInputElement>;
  scoreElement: Element;
  boardElement: HTMLElement;
  levelsController: LevelsController;
  level: Level;
  score: number;

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
   * returns a new card with initial properties
   * @param faceID
   */
  private static getNewCard(faceID:number): Card {
    return new Card(faceID);
  }

  /**
   * represents the croupier that deals with drawing and turning the cards
   * @param {LevelsController} levelsController
   */
  constructor(levelsController: LevelsController) {
    this.levelsController = levelsController;
    this.levelElements = document.querySelectorAll('.levels input');
    this.backgroundTypeElements = document.querySelectorAll('.type input');
    this.scoreElement = document.getElementsByClassName('score')[0];
    this.boardElement = document.getElementById('board');

    this.init();
  };

  /**
   * initialise the game with event handlers
   */
  private init(): void {
    this.levelsController.levelElements.forEach(el => {
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

    // reset content of the board
    this.boardElement.innerHTML = '';
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
      this.score = Math.max(100, this.score - 20);
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
    this.level.score = this.score;
    this.levelsController.finalizeLevel();
  }

  /**
   * start the game with a specific level -  more levels later default is 6
   * @param levelIndex
   */
  public startGame(levelIndex:number = 0): void {
    // get new level
    this.level = this.levelsController.resetLevel(levelIndex);
    const totalCards = this.level.rows * this.level.cols;
    this.score = this.levelsController.maxScore;

    // layout for the cards
    const sqrt = Math.sqrt(this.sqrtSpace / totalCards);
    const root = document.documentElement;
    root.style.setProperty('--square-root', `${sqrt}vmin`);
    root.style.setProperty('--repeat-columns', this.level.cols.toString());
    root.style.setProperty('--repeat-rows', this.level.rows.toString());

    this.resetGame(levelIndex);
    this.drawCards(totalCards);
  };

}
