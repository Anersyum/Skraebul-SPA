import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/_services/game.service';
import { GameManagerService } from 'src/app/_services/gameManager.service';
import { Guess_wordService } from 'src/app/_services/guess_word.service';

@Component({
  selector: 'app-word-choice',
  templateUrl: './word-choice.component.html',
  styleUrls: ['./word-choice.component.scss'],
  providers: [Guess_wordService],
  standalone: false
})
export class WordChoiceComponent implements OnInit {

  words : Array<string> = [];

  constructor(private gameService : GameService,
    private gameManagerService : GameManagerService, private wordService : Guess_wordService) { }

  ngOnInit() {
    const sub = this.wordService?.getWord().subscribe((x : Array<string>) => {
      this.gameManagerService!.canDraw = true;
      this.words = x;
      this.gameManagerService!.drawing = true;
      sub.unsubscribe();
    });
  }

  sendWord(chosenWord : string) {
      this.gameService?.sendWord(chosenWord);
      this.gameManagerService!.hideWord(chosenWord, true, this.gameService as GameService);
      this.gameManagerService!.isChosingWord = false;
  }

}
