import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/_models/Word';
import { Guess_wordService } from 'src/app/_services/guess_word.service';

@Component({
  selector: 'app-word-contaner',
  templateUrl: './word-contaner.component.html',
  styleUrls: ['./word-contaner.component.scss']
})
export class WordContanerComponent implements OnInit {

  word : string = "";
  constructor(private wordService: Guess_wordService) { }

  ngOnInit() {
    this.wordService.getWord().subscribe((x : Word) => {
      this.word = x?.word;
    });
  }

}
