import { Component, Input, OnInit, } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { GameService } from 'src/app/_services/game.service';
import { GameManagerService } from 'src/app/_services/gameManager.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  username : string = '';
  colors : Array<string> = ["red", "blue", "yellow"];
  color : string = this.colors[0];

  constructor(private userService : UserService, private gameService : GameService, 
    public gameManagerService : GameManagerService) { }

  ngOnInit() : void {
    this.username = this.userService.getName();
  }

  onKeyEnter(input : HTMLInputElement) : void {
    
    if (input.value == '') {
      return;
    }

    const message : Message = {
      username : this.username,
      message : input.value
    };

    this.gameService?.sendMessage(message);

    input.value = '';
  }

  guess(word : string, guessBox : HTMLInputElement) : void {

    const timer : number = this.gameManagerService?.timer as number;
    
    guessBox.value = '';
    this.gameService?.sendAnswer(word, timer);
  }
}
