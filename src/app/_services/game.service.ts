import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Message } from '../_models/Message';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private hubConnection : HubConnection | null = null;

  constructor(private userservice : UserService) {}

  connect() {
    let username = this.userservice.getName();
    
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5000/chathub?username=' + username)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
  }

  registerEvents(chatWindow : HTMLDivElement | undefined, pointsWindow : HTMLDivElement | undefined) : void {
    this.hubConnection?.on('RecieveMessage', (message : Message) => {
      chatWindow?.appendChild(this.createChatBubble(message));
      chatWindow!.scrollTop = chatWindow!.scrollHeight;
    });

    this.hubConnection?.on('Connected', (users : string, username : string) => {
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username));
    });

    this.hubConnection?.on('Disconnected', (users : string, username : string) => {
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username, false));
    });
  }

  startConnection() {
    this.hubConnection?.start().then(
      () => {
        console.log('Started');
      },
      error => console.error(error)
    );
  }

  private createChatBubble(message : Message) : HTMLParagraphElement {

    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const br = document.createElement('br');
    const span = document.createElement('span');

    strong.innerText = message.username + ':';
    span.innerText = message.message;
    
    p.appendChild(strong);
    p.appendChild(br);
    p.appendChild(span);

    p.style.margin = '0';
    p.style.padding = '0';
    p.style.marginBottom = '5px';

    return p;
  }

  private createPointsBubble(username : string) : HTMLParagraphElement {

    const p = document.createElement('p');
    const span = document.createElement('span');
    const br = document.createElement('br');

    span.innerText = username;

    p.appendChild(span);
    p.appendChild(br);

    return p;
  }

  private createConnectedBubble(username : string, connected : boolean = true) {
    
    const message = (connected) ? 'connected' : 'disconnected';
    const p = document.createElement('p');
    p.innerText = username + ' ' + message + '!';

    return p;
  }
  
  sendMessage(message : Message) : void {
    this.hubConnection?.invoke('SendMessage', message.username, message.message).catch((err : any) => { console.error(err.toString()) });
  }

  disconnect() : void {
    this.hubConnection?.stop();
  }
}
