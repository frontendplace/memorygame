import '../styles/index.scss';
import { Croupier } from './croupier';
import '../../favicon.ico';

(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const croupier = new Croupier();
    croupier.startGame();
  });
})();
