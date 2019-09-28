import '../styles/index.scss';
import { Croupier } from './croupier';
import '../../favicon.ico';
import { LevelsController } from './levelsController';

(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const levelsController = new LevelsController();
    const croupier = new Croupier(levelsController);

    croupier.startGame();
  });
})();
