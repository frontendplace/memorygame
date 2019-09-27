import {Card} from './card';
// @ts-ignore
import * as Handlebars from 'handlebars';

interface matrix {
  rows: number;
  cols: number;
}

interface cardConfig {
  levels: matrix[];
}

export class Croupier {
  cardsConfig: cardConfig; // later specify this in
  card1Picked: Card;
  card2Picked: Card;
  totalCards: number;
  cards: Card[];
  maxScore: number;
  sqrtSpace = 2700;

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

  constructor() {
    this.init();
  };

  /**
   * initialise the game
   */
  private init(): void {
    this.cardsConfig = {
      levels: [
        {rows: 2, cols: 2},
        {rows: 2, cols: 3},
        {rows: 3, cols: 4},
        {rows: 4, cols: 4},
        {rows: 4, cols: 5},
        {rows: 4, cols: 6},
        {rows: 5, cols: 6},
      ]
    };

    document.querySelectorAll('.levels input').forEach(el => {
      el.addEventListener('change', evt => {
        const level = (<HTMLInputElement>evt.target).value;
        this.startGame(Number(level));
      })
    });

    this.resetGame();
  };

  /**
   * reset all to start position
   */
  private resetGame(): void{
    this.card1Picked = null;
    this.card2Picked = null;
    this.totalCards = 0;
    this.cards = [];
    this.maxScore = 500;
    const board   = document.getElementById("board");
    board.innerHTML = '';
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
   * returns a new card with initial properties
   * @param faceID
   */
  private static getNewCard(faceID:number): Card {
    return new Card(faceID);
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
      console.log('hooraa');
      document.getElementsByClassName('score')[0].classList.add('show');
      document.getElementById('total-score').innerText = this.maxScore.toString();
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

  /**
   * start the game with a specific level -  more levels later default is 6
   * @param level
   */
  public startGame(level:number = 6): void {
    let root = document.documentElement;

    console.log(`starting! level ${level}` );
    const totalCards = this.cardsConfig.levels[level].rows * this.cardsConfig.levels[level].cols;
    const sqrt = Math.sqrt(this.sqrtSpace / totalCards);

    root.style.setProperty('--square-root', `${sqrt}vmin`);
    root.style.setProperty('--repeat-columns', this.cardsConfig.levels[level].cols.toString());
    root.style.setProperty('--repeat-rows', this.cardsConfig.levels[level].rows.toString());

    this.resetGame();
    this.drawCards(totalCards);
  };

}
