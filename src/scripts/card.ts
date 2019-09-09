export class Card {
  cardFace: number;
  cardElement: HTMLElement;
  matched: boolean;
  faceUp: boolean;
  clickHandler: any;

  constructor(element:HTMLElement) {
    this.cardElement = element;
    this.init();
  };

  init() {
    this.cardFace = 0;
    this.cardElement = null;
    this.matched = false;
    this.faceUp = false;
    this.clickHandler = null;
  };

  /**
   * reset card to faceDown with timeout
   */
  public returnCard(){
    setTimeout(() => {
      this.setFaceUp(false)
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
   * create eventlistener on the card at creation
   * @param cb the function to be called at the game
   */
  public onCardClicked(cb:Function) {
    this.clickHandler = () => {
      if (!this.faceUp) {
        this.setFaceUp(true);
        cb(this);
      }
    };

    this.cardElement.addEventListener('click', this.clickHandler, false)
  }

  /**
   * set matched and stop click events from happening
   */
  public setMatched(){
    this.matched = true;
    this.cardElement.removeEventListener('click', this.clickHandler, false);
    // set css style not clickable anymore
  }

  /**
   * store the face for the classes
   * @param isUp
   */
  private setFaceUp(isUp:boolean){
    this.faceUp = isUp;
    // set class for faceup on element
    //$(this).closest('.card').removeClass('flipped')
    //$(this).closest('.card').addClass('flipped')
  }
}
