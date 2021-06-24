import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { Player } from 'src/app/_models/Player';
import { GameService } from 'src/app/_services/game.service';
import { UserService } from 'src/app/_services/user.service';
import { WordContanerComponent } from '../word-contaner/word-contaner.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  @ViewChild('chatBox') chatbox? : ElementRef<HTMLDivElement>;
  @Input() gameService : GameService | null = null;
  @Input() wordContainerComponent : WordContanerComponent | null = null;
  @Input() chatMessage? : Player | Message;
  @Input() isDrawer? : boolean;
  username : string = '';
  colors : Array<string> = ["red", "blue", "yellow"];
  color : string = this.colors[0];

  constructor(private userService : UserService) { }

  ngOnInit() : void {
    this.username = this.userService.getName();
    console.log(this.isDrawer);
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

    const timer : number = this.wordContainerComponent?.timer as number;
    guessBox.value = '';
    this.gameService?.sendAnswer(word, timer);
  }
}
