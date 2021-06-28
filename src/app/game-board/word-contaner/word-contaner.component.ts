import { Component, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/_services/game.service';
import { GameManagerService } from 'src/app/_services/gameManager.service';

@Component({
  selector: 'app-word-contaner',
  templateUrl: './word-contaner.component.html',
  styleUrls: ['./word-contaner.component.scss']
})
export class WordContanerComponent implements OnDestroy {

  constructor(public gameService : GameService, public gameManagerService : GameManagerService) { }

  ngOnDestroy(): void {
    this.gameManagerService?.disableTimer();
  }
}
