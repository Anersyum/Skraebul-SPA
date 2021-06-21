import { AfterViewInit, COMPILER_OPTIONS, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { Player } from 'src/app/_models/Player';
import { GameService } from 'src/app/_services/game.service';
import { GameManagerService } from 'src/app/_services/gameManager.service';
import { UserService } from 'src/app/_services/user.service';
import { WordContanerComponent } from '../word-contaner/word-contaner.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnChanges {

  @ViewChild('chatBox') chatbox? : ElementRef<HTMLDivElement>;
  @Input() gameService : GameService | null = null;
  @Input() wordContainerComponent : WordContanerComponent | null = null;
  @Input() playerLoggedIn? : Player;
  isDrawer : boolean = true;
  username : string = '';
  colors : Array<string> = ["red", "blue", "yellow"];
  color : string = this.colors[0];

  constructor(private userService : UserService) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.playerLoggedIn) {
      const p : HTMLParagraphElement = document.createElement('p');
      
      if (this.playerLoggedIn?.loggedIn) {
        p.innerText = 'User ' + this.playerLoggedIn.username + ' connected!';
        this.chatbox?.nativeElement.appendChild(p);
        return;
      }

      p.innerText = 'User ' + this.playerLoggedIn?.username + ' disconnected!';
      this.chatbox?.nativeElement.appendChild(p);
    }
  }
  
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

  guess(word : string, guessBox : HTMLInputElement) {

    const timer : number = this.wordContainerComponent?.timer as number;
    guessBox.value = '';
    this.gameService?.sendAnswer(word, timer);
  }

  test(e : any) {
    alert("radi");
  }
}
