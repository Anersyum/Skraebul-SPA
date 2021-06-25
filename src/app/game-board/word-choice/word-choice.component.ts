import { Component, Input, OnInit } from '@angular/core';
import { GameService } from 'src/app/_services/game.service';
import { GameManagerService } from 'src/app/_services/gameManager.service';
import { Guess_wordService } from 'src/app/_services/guess_word.service';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { GameBoardComponent } from '../game-board.component';
import { WordContanerComponent } from '../word-contaner/word-contaner.component';

@Component({
  selector: 'app-word-choice',
  templateUrl: './word-choice.component.html',
  styleUrls: ['./word-choice.component.scss']
})
export class WordChoiceComponent implements OnInit {

  @Input() gameService : GameService | null = null;
  @Input() wordContainerComponent : WordContanerComponent | null = null;
  @Input() chatWindowComponent : ChatWindowComponent | null = null;
  @Input() gameBoardComponent : GameBoardComponent | null = null;
  @Input() gameManagerService : GameManagerService | null = null;
  words : Array<string> = []; 
  constructor(private wordService : Guess_wordService) { }

  ngOnInit() {
    this.wordService.getWord().subscribe((x : Array<string>) => {
      this.gameBoardComponent!.canDraw = true;
      this.words = x;
      // this.gameService?.sendWord(gottenWord);
      // this.wordContainerComponent?.hideWord(gottenWord, true);
      this.gameManagerService!.drawing = true;
    });
  }

  sendWord(chosenWord : string) {
      this.gameService?.sendWord(chosenWord);
      this.gameManagerService!.hideWord(chosenWord, true, this.gameService as GameService);
      this.gameManagerService!.isChosingWord = false;
  }

}
