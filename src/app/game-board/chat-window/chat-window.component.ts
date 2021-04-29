import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chat } from 'src/app/_models/Chat';
import { ChatService } from 'src/app/_services/chat.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('chatBox') chatbox? : ElementRef<HTMLDivElement>;
  messages : string = '';
  username : string = '<strong>Amor</strong>';

  constructor(private userservice : UserService, private chatservice : ChatService) { }
  
  ngAfterViewInit(): void {
    this.chatservice.registerEvents(this.chatbox?.nativeElement);
  }

  ngOnInit() : void {
    this.username = this.userservice.getName();
  }

  onKeyEnter(input : HTMLInputElement) : void {
    
    if (input.value == '') {
      return;
    }

    const message : Chat = {
      username : this.username,
      message : input.value
    };

    this.chatservice.sendMessage(message);

    input.value = '';
  }

  ngOnDestroy(): void {
    this.userservice.deleteName();
  }
}
