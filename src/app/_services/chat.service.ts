import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Chat } from '../_models/Chat';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection : HubConnection | null = null;

  constructor(private userservice : UserService) {}

  connect() {
    let username = this.userservice.getName();
    
    this.hubConnection = new HubConnectionBuilder()
    .withUrl("http://localhost:5000/chathub?username=" + username)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
  }

  registerEvents(chatWindow : HTMLDivElement | undefined, pointsWindow : HTMLDivElement | undefined) : void {
    this.hubConnection?.on("RecieveMessage", (message : Chat) => {
      chatWindow?.appendChild(this.createChatBubble(message));
      chatWindow!.scrollTop = chatWindow!.scrollHeight;
    });

    this.hubConnection?.on("Connected", (users : string, username : string) => {
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username));
    });

    this.hubConnection?.on("Disconnected", (users : string, username : string) => {
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username, false));
    });
  }

  startConnection() {
    this.hubConnection?.start().then(
      () => {
        console.log("Started");
      },
      error => console.error(error)
    );
  }

  private createChatBubble(message : Chat) : HTMLParagraphElement {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const br = document.createElement('br');
    const span = document.createElement('span');

    strong.innerText = message.username + ':';
    span.innerText = message.message;
    
    p.appendChild(strong);
    p.appendChild(br);
    p.appendChild(span);

    return p;
  }

  private createPointsBubble(username : string) : HTMLParagraphElement {

    const p = document.createElement("p");
    const span = document.createElement("span");
    const br = document.createElement("br");
    const span2 = document.createElement("span");

    span.innerText = username;
    span2.innerText = "0";

    p.appendChild(span).appendChild(br).appendChild(span2);

    return p;
  }

  private createConnectedBubble(username : string, connected : boolean = true) {
    
    const message = (connected) ? 'connected' : 'disconnected';
    const p = document.createElement("p");
    p.innerText = username + ' ' + message + '!';

    return p;
  }
  
  sendMessage(message : Chat) : void {
    this.hubConnection?.invoke('SendMessage', message.username, message.message).catch((err : any) => { console.error(err.toString()) });
  }

  disconnect() : void {
    this.hubConnection?.stop();
  }
}
