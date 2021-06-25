import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameService } from 'src/app/_services/game.service';
import { GameManagerService } from 'src/app/_services/gameManager.service';

@Component({
  selector: 'app-word-contaner',
  templateUrl: './word-contaner.component.html',
  styleUrls: ['./word-contaner.component.scss']
})
export class WordContanerComponent implements OnDestroy {

  @Input() public gameService : GameService | null = null;
  @Input() gameManagerService? : GameManagerService;

  constructor() { }

  ngOnDestroy(): void {
    this.gameManagerService?.disableTimer();
  }
}
