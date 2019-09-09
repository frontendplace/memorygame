import '../styles/index.scss';

console.log('webpack starterkit2');

import { Croupier } from './croupier';

(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const croupier = new Croupier();
    croupier.startGame();
  });
})();
