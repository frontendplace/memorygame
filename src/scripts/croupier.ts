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

  init() {
    this.cardsConfig = {
      levels: [4,6,8,12,16,20,24,30]
    };

    this.resetGame();
  };

  /**
   * reset all to start position
   */
  resetGame(){
    this.card1Picked = null;
    this.card2Picked = null;
    this.totalCards = 0;
    this.cards = [];
    //this.maxScore = 0;
  }

  /**
   * start the game with a specific level // todo more levels later default is 6
   * @param level
   */
  startGame(level:number = 6) {
    console.log(`starting! level ${level}` );
    this.resetGame();
    this.drawCards(this.cardsConfig.levels[level]);

  };

  /**
   * draw a number/2 cards twice
   * @param totalCards
   */
  drawCards(totalCards: number){
    let i;
    for(i = 1; i <= totalCards/2; i++){
      // add dom element to game container
      const newCard = new Card(null);
      newCard.cardFace = i;
      const doubleCard = new Card(null);
      doubleCard.cardFace = i;
      this.cards.push(newCard);
      this.cards.push(doubleCard);
    }
    console.log(this.cards);

    Croupier.shuffleCards(this.cards);
    this.createCardElements(this.cards);
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
   * compiles the handlebars templete and creates the board in dom
   * @param cards
   */
  createCardElements(cards:Card[]): HTMLElement {
    const board   = document.getElementById("board");
    const source   = document.getElementById("cards-template").innerHTML;
    const template = Handlebars.compile(source);
    const html =  template({
      cards: this.cards
    });
    board.innerHTML += html;
    return html;
  }

}
