import { Component, OnDestroy, OnInit } from '@angular/core';
import { Word } from 'src/app/_models/Word';
import { Guess_wordService } from 'src/app/_services/guess_word.service';

@Component({
  selector: 'app-word-contaner',
  templateUrl: './word-contaner.component.html',
  styleUrls: ['./word-contaner.component.scss']
})
export class WordContanerComponent implements OnInit, OnDestroy {

  word : string = '';
  timer : number = 60;
  timerInterval : any;

  constructor(private wordService: Guess_wordService) { }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  ngOnInit() {
    this.hideWord()
  }

  private hideWord() {

    let gottenWord : Word;

    this.wordService.getWord().subscribe((x : Word) => {
      gottenWord = x;

      this.word = gottenWord.word;
      
      for (let i = 0; i < this.word.length; i++) {
        
        if (this.word[i].match(/([A-Za-z])+/)) {
          this.word = this.word.replace(this.word[i], '_');
        }
      }

      this.startTimer(gottenWord);
    });
  }

  private startTimer(gottenWord : Word) {
    this.timerInterval = setInterval(() => {
      this.timer--;
      console.log(this.timer);
      if (this.timer % 15 == 0) {
        let randPos = Math.floor(Math.random() * this.word.length);
        this.word = this.word.slice(0, randPos) + gottenWord.word[randPos] + this.word.slice(randPos + 1);
      }

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

}
