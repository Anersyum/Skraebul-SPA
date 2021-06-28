import { Injectable, OnDestroy } from '@angular/core';
import { Message } from '../_models/Message';
import { Player } from '../_models/Player';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService implements OnDestroy {

  private players : Array<Player> | null = null;
  player? : Player;
  message? : Message;
  drawing : boolean = true;
  word : string = '';
  timer : number = 60;
  private timerInterval : any;
  sentLetters : Array<string> = [];
  isChosingWord : boolean = false;
  isDrawing : boolean = false;
  canDraw : boolean = false;
  canStartGame : boolean = false;

  constructor() { }

  ngOnDestroy(): void {
    alert("destroyed game manager");
  }
  
  setPlayers(players : Array<Player>) : void {
    this.players = players;
  }

  getPlayers() : Array<Player> | null {
    return this.players;
  }

  resetHiddenWord() : void {
    this.word = '';
  }

  hideWord(gottenWord : string, isAdmin : boolean, gameService : GameService) : void {

    this.word = gottenWord;

    if (!isAdmin) {
      for (let i = 0; i < this.word.length; i++) {
        
        if (this.word[i].match(/([A-Za-z])+/)) {
          this.word = this.word.replace(this.word[i], '_');
        }
      }
    }

    this.startTimer(gameService);
  }

  private startTimer(gameService : GameService) : void {
    this.timerInterval = setInterval(() => {
      --this.timer;
      console.log(this.timer);
      if (this.timer % 15 == 0) {
        let randPos = Math.floor(Math.random() * this.word.length);
        while (this.sentLetters.indexOf(this.word[randPos]) > -1) {
          if (this.sentLetters.length >= this.word.length) {
            break;
          }

          randPos = Math.floor(Math.random() * this.word.length);
        }
        gameService.sendUncoveredLetter(this.word[randPos], randPos);
      }

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  uncoverLetter(letter : string, letterPoistion : number) : void {
    this.word = this.word.slice(0, letterPoistion) + letter + this.word.slice(letterPoistion + 1);
  }

  disableTimer() {
    clearInterval(this.timerInterval);
  }

  finishGame() {
    this.canDraw = false;
    this.canStartGame = false;
    this.disableTimer();
    this.timer = 60;
  }

  finishRound() {
    this.word = '';
    this.timer = 60;
  }

  destroy() {
    this.disableTimer();
  }
}
