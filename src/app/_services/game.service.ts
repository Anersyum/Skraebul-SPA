import { Position } from '../_models/Position';
import { Move } from '../_models/Move';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameManager } from '../_models/GameManager';
import { Message } from '../_models/Message';
import { UserService } from './user.service';
import { Player } from '../_models/Player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private hubConnection : HubConnection | null = null;

  constructor(private userservice : UserService) {}

  connect() : void {
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

    this.hubConnection?.on('Connected', (users : Array<Player>, username : string) => {
      console.log(users)
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username)); 
      this.setAdmin(users, gameBoardComponent);
    });

    this.hubConnection?.on('Disconnected', (users : Array<Player>, username : string) => {
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username, false));
    });

    this.hubConnection?.on("RecieveMove", (move : Move) => {
      const coordinates = this.getAdaptedCoordinates(gameBoardComponent, move);
      const x = coordinates[0];
      const y = coordinates[1];

      if (move.isUndo) {
        const isSentMove = true;
        gameBoardComponent.undo(isSentMove);
        return;
      }

      if (move.drawing == 0) {
          gameBoardComponent.color = move.brushColor as string;
          gameBoardComponent.brushWidth = move.brushWidth as number;
          gameBoardComponent.initializePen();

          gameBoardComponent.context?.moveTo(
            x - gameBoardComponent.xOffset,
            y - gameBoardComponent.yOffset);
          gameBoardComponent.context?.beginPath();
      }
      else if (move.drawing == 1) {
        gameBoardComponent.context?.lineTo(
          x - gameBoardComponent.xOffset,
          y - gameBoardComponent.yOffset);
        gameBoardComponent.context?.stroke();
      }
      else if (move.drawing == 3) {
        gameBoardComponent.context?.clearRect(0, 0, gameBoardComponent.canvas!.width, gameBoardComponent.canvas!.height);
      }

      gameBoardComponent.addToDrawingStack({
        x: x - gameBoardComponent.xOffset,
        y: y - gameBoardComponent.yOffset,
        drawing: move.drawing,
        brushColor: move.brushColor as string,
        brushWidth: move.brushWidth as number
      });
    });
  }

  private setAdmin(users : Array<Player>, gameBoardComponent : GameBoardComponent) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      if (user.username == this.userservice.getName()) {
        gameBoardComponent.canStartGame = user.isAdmin;
      }
    }
  }

  private getAdaptedCoordinates(gameBoardComponent : GameBoardComponent, move : Move) : Array<number> {
    let shouldMultiply : boolean = false;
    let ratioX : number = move.canvasWidth / (gameBoardComponent.canvas?.width as number);
    let ratioY : number = (move.canvasHeight as number) / (gameBoardComponent.canvas?.height as number);

    if (move.canvasWidth < (gameBoardComponent.canvas?.width as number)) {
      shouldMultiply = true;
      ratioX = (gameBoardComponent.canvas?.width as number) / move.canvasWidth;
      ratioY = (gameBoardComponent.canvas?.height as number) / (move.canvasHeight as number);
    }

    let x : number = move.x;
    let y : number = move.y;

    if (shouldMultiply) {

      x *= ratioX;
      y *= ratioY;
    }
    else {
      x /= ratioX;
      y /= ratioY;
    }

    return [x, y];
  }

  startConnection() : void {
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

  private createPointsBubble(users : Array<Player>) : HTMLParagraphElement {

    const p = document.createElement('p');

    for (let i = 0; i < users.length; i++) {
      
      const userParagraph = document.createElement('p');
  
      userParagraph.innerText = users[i].username + ' ' + users[i].points;
      userParagraph.style.margin = '5px';

      p.appendChild(userParagraph);
    }

    return p;
  }

  private createConnectedBubble(username : string, connected : boolean = true) : HTMLParagraphElement {
    
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
