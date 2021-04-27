import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnDestroy {

  messages : string = '';
  username : string = '<strong>Amor</strong>';

  constructor(private userservice : UserService) { }

  ngOnInit() : void {
    this.username = '<strong>' + this.userservice.getName() + '</strong>';
  }

  onKeyEnter(input : HTMLInputElement, chatbox : HTMLDivElement) : void {
    
    if (input.value == '') {
      return;
    }
    
    chatbox.innerHTML += '<p>' + this.username + ':<br />' + input.value + '</p>';
    input.value = '';
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  ngOnDestroy(): void {
    this.userservice.deleteName();
  }
}
