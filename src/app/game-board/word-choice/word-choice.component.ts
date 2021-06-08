import { Component, Input, OnInit } from '@angular/core';
import { Word } from 'src/app/_models/Word';
import { GameService } from 'src/app/_services/game.service';
import { Guess_wordService } from 'src/app/_services/guess_word.service';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { WordContanerComponent } from '../word-contaner/word-contaner.component';

@Component({
  selector: 'app-word-choice',
  templateUrl: './word-choice.component.html',
  styleUrls: ['./word-choice.component.scss']
})
export class WordChoiceComponent implements OnInit {

  @Input() canDraw : boolean | null = null;
  @Input() gameService : GameService | null = null;
  @Input() wordContainerComponent : WordContanerComponent | null = null;
  @Input() chatWindowComponent : ChatWindowComponent | null = null;
  words : Array<Word> = []; 
  constructor(private wordService : Guess_wordService) { }

  ngOnInit() {
    this.wordService.getWord().subscribe((x : Array<Word>) => {
      this.canDraw = true;
      this.words = x;
      // this.gameService?.sendWord(gottenWord);
      // this.wordContainerComponent?.hideWord(gottenWord, true);
      this.chatWindowComponent!.isDrawer = true;
    });
  }

  sendWord(chosenWord : Word) {
      this.gameService?.sendWord(chosenWord);
      this.wordContainerComponent?.hideWord(chosenWord, true);
  }

}
