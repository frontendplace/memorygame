import {Card} from "./card";
import * as Handlebars from "handlebars";

interface cardConfig {
  levels: number[];
}

export class Croupier {

  cardsConfig: cardConfig; // later specify this in
  card1Picked: Card;
  card2Picked: Card;
  totalCards: number;
  cards: Card[];
  //maxScore: number;

  constructor() {
    this.init();
  };

  /**
   * start the game with a specific level // todo more levels later default is 6
   * @param level
   */
  public startGame(level:number = 6): void {
    console.log(`starting! level ${level}` );
    this.resetGame();
    this.drawCards(this.cardsConfig.levels[level]);
  };

  /**
   * handle card turning
   */
  private handleCardTurn(card:Card):void {
    console.log('handleCardTurn', card);
    // // if cards don't match, return
    // if (!this.selectedCard1.isPair(this.selectedCard2))
    //   return;
    //
    // // yay, cards match!
    // this.selectedCard1.matchFound();
    // this.selectedCard2.matchFound();
    //
    // this.selectedCard1 = null;
    // this.selectedCard2 = null;
    //
    // this.checkAllFound();
  }

  /**
   * Shuffles array in place
   * @param {Array} cards items
   */
  private static shuffleCards(cards:Card[]): Card[] {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    console.log(cards);
    return cards;
  }

  /**
   * compiles the handlebars template and creates the card in dom with eventhandlers
   * @param card
   * @param index
   */
  private static createCardElement(card:Card, index:number) {
    const board   = document.getElementById("board");
    const source   = document.getElementById("card-template").innerHTML;
    const template = Handlebars.compile(source);
    const html =  template({card,index});
    let frag = document.createRange().createContextualFragment(html);
    let button = frag.querySelector('button');

    button.addEventListener('click', card.clickHandler);
    board.appendChild(frag);
  }

  /**
   * initialise the game
   */
  private init(): void {
    this.cardsConfig = {
      levels: [4,6,8,12,16,20,24,30]
    };

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
    //this.maxScore = 0;
  }

  /**
   * draw a number/2 cards twice
   * @param totalCards
   */
  private drawCards(totalCards: number): void{
    let i;
    for(i = 1; i <= totalCards/2; i++){
      const firstCard = this.getNewCard(i);
      const secondCard = this.getNewCard(i);
      this.cards.push(firstCard);
      this.cards.push(secondCard);
    }
    Croupier.shuffleCards(this.cards);

    this.cards.forEach((card, index) => {
      Croupier.createCardElement(card, index);
    });
  }

  /**
   * returns a new card with initial properties
   * @param faceID
   */
  private getNewCard(faceID:number): Card {
    return new Card(faceID, this.handleCardTurn);
  }

  /**
   * test if all cards have a match
   */
  private checkAllMatched():boolean {
    return this.cards.every( (card:Card, _1, _2):boolean => {
      return card.matched;
    });
  }

}
