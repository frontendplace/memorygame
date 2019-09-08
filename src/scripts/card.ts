export class Card {
  cardFace: number;
  matched: boolean;
  faceUp: boolean;
  clickHandler: EventListenerObject;
  clickCallBack: Function;

  constructor(cardFace:number, clickCallBack: Function) {
    this.init(cardFace, clickCallBack);
  };

  init(cardFace:number, clickCallBack: Function) {
    this.clickCallBack = clickCallBack;
    this.cardFace = cardFace;
    this.matched = false;
    this.faceUp = false;
    this.clickHandler = {
      handleEvent: () => {
        if (!this.faceUp && !this.matched) {
          this.setFaceUp(true);
          this.clickCallBack(this);
        }
      }
    };
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

  // /**
  //  * create eventlistener on the card at creation
  //  * @param cb the function to be called at the game
  //  */
  // public onCardClicked(cb:Function) {
  //   // Define object with `handleEvent` function
  //   this.clickHandler = {
  //     handleEvent: (event) => {
  //       alert(event.type);
  //       if (!this.faceUp) {
  //         this.setFaceUp(true);
  //         this.clickCallBack(this);
  //       }
  //     }
  //   };

// // Listen for 'click' events on the <button> and handle them with `myObject`... WHAT?!?!
//     btn.addEventListener('click', myObject);
//
//     this.clickHandler = () => {
//       if (!this.faceUp) {
//         this.setFaceUp(true);
//         this.clickCallBack(this);
//       }
//     };
//     //this.cardElement.addEventListener('click', this.clickHandler, false)
//   }

  /**
   * set matched and stop click events from happening
   */
  public setMatched(){
    this.matched = true;
    // this.cardElement.removeEventListener('click', this.clickHandler, false);
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
