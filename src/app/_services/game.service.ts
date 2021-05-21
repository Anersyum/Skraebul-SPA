import { Position } from '../_models/Position';
import { Move } from '../_models/Move';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameManager } from '../_models/GameManager';
import { Message } from '../_models/Message';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private hubConnection : HubConnection | null = null;
  public gameManager : GameManager | null = null;

  constructor(private userservice : UserService) {}

  connect() {
    let username = this.userservice.getName();
    
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5000/chathub?username=' + username)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
  }

  registerEvents(chatWindow : HTMLDivElement | undefined, pointsWindow : HTMLDivElement | undefined, gameBoardComponent : GameBoardComponent) : void {
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

    this.hubConnection?.on("RecieveMove", (position : Move) => {
      console.log(gameBoardComponent.xOffset, "meho");
      console.log(position.canvasWidth, "dammit");
      let multiply : boolean = false;
      let ratioX : number = position.canvasWidth / (gameBoardComponent.canvas?.width as number);
      let ratioY : number = (position.canvasHeight as number) / (gameBoardComponent.canvas?.height as number);

      if (position.canvasWidth < (gameBoardComponent.canvas?.width as number)) {
        multiply = true;
        ratioX = (gameBoardComponent.canvas?.width as number) / position.canvasWidth;
        ratioY = (gameBoardComponent.canvas?.height as number) / (position.canvasHeight as number);
      }

      let positionX : number = position.x;
      let positionY : number = position.y;

      if (multiply) {

        positionX *= ratioX;
        positionY *= ratioY;
      }
      else {
        positionX /= ratioX;
        positionY /= ratioY;
      }

      if (position.drawing == 0) {
          gameBoardComponent.color = position.brushColor as string;
          gameBoardComponent.brushWidth = position.brushWidth as number;
          gameBoardComponent.initializePen();

          gameBoardComponent.context?.moveTo(
            positionX - gameBoardComponent.xOffset,
            positionY - gameBoardComponent.yOffset);
          gameBoardComponent.context?.beginPath();
      }
      else if (position.drawing == 1) {
        gameBoardComponent.context?.lineTo(
          positionX - gameBoardComponent.xOffset,
          positionY - gameBoardComponent.yOffset);
        gameBoardComponent.context?.stroke();
      }
      else if (position.drawing == 3) {
        gameBoardComponent.context?.clearRect(0, 0, gameBoardComponent.canvas!.width, gameBoardComponent.canvas!.height);
      }
    })
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
    const users = username.split('|');

    for (let i = 0; i < users.length - 1; i++) {
      
      const userParagraph = document.createElement('p');
  
      userParagraph.innerText = users[i];
      userParagraph.style.margin = '5px';

      p.appendChild(userParagraph);
    }

    return p;
  }

  private createConnectedBubble(username : string, connected : boolean = true) {
    
    const message = (connected) ? 'connected' : 'disconnected';
    const p = document.createElement('p');
    p.innerText = username + ' ' + message + '!';

    return p;
  }
  
  sendMessage(message : Message) : void {
    this.hubConnection?.invoke('SendMessage', message.username, message.message).catch((err : any) => { console.error(err.toString()); });
  }

  disconnect() : void {
    this.hubConnection?.stop();
  }

  sendMove(position : Move) : void {
    this.hubConnection?.invoke('SendMove', position).catch((err : any) => { console.error(err);  }) ;
  } 
}
