import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { GameService } from 'src/app/_services/game.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  @ViewChild('chatBox') chatbox? : ElementRef<HTMLDivElement>;
  @Input() gameService : GameService | null = null;
  username : string = '';

  constructor(private userService : UserService) { }
  
  ngAfterViewInit(): void {
  }

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

  guess(word : string) {
    
  }
}
