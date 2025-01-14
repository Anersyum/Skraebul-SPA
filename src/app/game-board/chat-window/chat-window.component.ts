import { Component, Input, OnInit, } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { GameService } from 'src/app/_services/game.service';
import { GameManagerService } from 'src/app/_services/gameManager.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  standalone: false
})
export class ChatWindowComponent implements OnInit {

  username : string = '';
  colors : Array<string> = ["red", "blue", "yellow"];
  color : string = this.colors[0];

  constructor(public userService : UserService, private gameService : GameService,
    public gameManagerService : GameManagerService) { }

  ngOnInit() : void {
    this.username = this.userService.getName();
  }

  guess(word : string, guessBox : HTMLInputElement) : void {

    if (word == '') {
      return;
    }

    const timer : number = this.gameManagerService?.timer as number;

    guessBox.value = '';
    this.gameService?.sendAnswer(word, timer);
  }
}
