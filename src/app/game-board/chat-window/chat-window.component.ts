import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  messages : string = '';
  username : string = '<strong>Amor</strong>';

  constructor() { }

  ngOnInit() {
  }

  onKeyEnter(input : HTMLInputElement, chatbox : HTMLDivElement) {
    chatbox.innerHTML += '<p>' + this.username + ':<br />' + input.value + '</p>';
    input.value = '';
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}
