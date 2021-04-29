import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Chat } from '../_models/Chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection : HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chathub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
   }

  registerEvents(element : HTMLDivElement | undefined) {
    this.hubConnection.on("RecieveMessage", (message : Chat) => {

      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const br = document.createElement('br');
      const span = document.createElement('span');

      strong.innerText = message.username + ':';
      span.innerText = message.message;
      
      p.appendChild(strong);
      p.appendChild(br);
      p.appendChild(span);

      element!.appendChild(p);
      element!.scrollTop = element!.scrollHeight;
    });

    this.hubConnection.start().then(
      () => {
        console.log("Started");
      },
      error => console.error(error)
    );
  }

  sendMessage(message : Chat) {
    console.log(message)
    this.hubConnection.invoke('SendMessage', message.username, message.message).catch((err : any) => { console.error(err.toString())});
  }
}
