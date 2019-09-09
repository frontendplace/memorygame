export class Card {
  cardFace: number;
  matched: boolean;
  faceUp: boolean;
  element: HTMLElement;

  constructor(cardFace:number) {
    this.init(cardFace);
  };

  init(cardFace:number) {
    this.cardFace = cardFace;
    this.matched = false;
    this.faceUp = false;
    this.element = null;
  };

  /**
   * reset card to faceDown with timeout
   */
  public hideCard(){
    setTimeout(() => {
      this.hide()
    }, 2000);
  }

  /**
   * test if current face is same as previous card face
   * @param other
   */
  public isMatchedWith(other:Card): boolean{
    return this.cardFace === other.cardFace;
  }

  /**
   * set matched and stop click events from happening
   */
  public setMatched(){
    this.matched = true;
  }

  /**
   * show the card
   */
  public show(){
    this.faceUp = true;
    this.element.querySelector('button').classList.remove('flipped');
  }

  /**
   * hide the card
   */
  public hide(){
    this.faceUp = false;
    this.element.querySelector('button').classList.add('flipped');
  }
}
