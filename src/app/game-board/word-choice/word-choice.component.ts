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
  constructor(private wordService : Guess_wordService) { }

  ngOnInit() {
    this.canDraw = true;
    let gottenWord : Word;

    this.wordService.getWord().subscribe((x : Word) => {
      
      gottenWord = x;
      this.gameService?.sendWord(gottenWord);
      this.wordContainerComponent?.hideWord(gottenWord, true);
      this.chatWindowComponent!.isDrawer = true;
    });
  }

}
