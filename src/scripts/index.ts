import '../styles/index.scss';
import { Croupier } from './croupier';

(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const croupier = new Croupier();
    croupier.startGame(4);
  });
})();
