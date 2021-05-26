import { Position } from '../_models/Position';
import { Move } from '../_models/Move';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameManager } from '../_models/GameManager';
import { Message } from '../_models/Message';
import { UserService } from './user.service';
import { Player } from '../_models/Player';
import { Word } from '../_models/Word';
import { WordContanerComponent } from '../game-board/word-contaner/word-contaner.component';

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

  registerEvents(chatWindow : HTMLDivElement | undefined, pointsWindow : HTMLDivElement | undefined,
    gameBoardComponent : GameBoardComponent, wordContainerComponent : WordContanerComponent) : void {
    this.hubConnection?.on('RecieveMessage', (message : Message) => {
      chatWindow?.appendChild(this.createChatBubble(message));
      chatWindow!.scrollTop = chatWindow!.scrollHeight;
    });

    this.hubConnection?.on('Connected', (users : Array<Player>, username : string) => {
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username)); 
      this.setAdmin(users, gameBoardComponent);
    });

    this.hubConnection?.on('Disconnected', (users : Array<Player>, username : string) => {
      pointsWindow?.firstChild?.replaceWith(this.createPointsBubble(users));
      chatWindow?.appendChild(this.createConnectedBubble(username, false));
      this.setAdmin(users, gameBoardComponent);
    });

    this.hubConnection?.on("RecieveMove", (move : Move) => {
      const coordinates : Position = this.getAdaptedCoordinates(gameBoardComponent, move);
      const offsetCoordinates : Position = {
        x: coordinates.x - gameBoardComponent.xOffset,
        y: coordinates.y - gameBoardComponent.yOffset
      };

      if (move.isUndo) {
        const isSentMove = true;
        gameBoardComponent.undo(isSentMove);
        return;
      }

      if (move.drawing == 0) {
          gameBoardComponent.color = move.brush.brushColor as string;
          gameBoardComponent.brushWidth = move.brush.brushWidth as number;
          gameBoardComponent.initializePen();

          gameBoardComponent.context?.moveTo(
            offsetCoordinates.x,
            offsetCoordinates.y);
          gameBoardComponent.context?.beginPath();
      }
      else if (move.drawing == 1) {
        gameBoardComponent.context?.lineTo(
          offsetCoordinates.x,
          offsetCoordinates.y);
        gameBoardComponent.context?.stroke();
      }
      else if (move.drawing == 3) {
        gameBoardComponent.context?.clearRect(0, 0, gameBoardComponent.canvas!.width, gameBoardComponent.canvas!.height);
      }

      gameBoardComponent.addToDrawingStack({
        position: offsetCoordinates,
        drawing: move.drawing,
        brush: move.brush,
        canvas: move.canvas,
        isUndo: move.isUndo
      });
    });

    this.hubConnection?.on('RecieveChosenWord', (word : string) => {
      wordContainerComponent.hideWord({word: word}, false);
    });

    this.hubConnection?.on('RecieveUncoveredLetter', (letter : string, letterPoistion : number) => {
      wordContainerComponent.uncoverLetter(letter, letterPoistion);
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

  private getAdaptedCoordinates(gameBoardComponent : GameBoardComponent, move : Move) : Position {
    const sentMoveCanvasWidth : number = move.canvas?.canvasWidth as number;
    const sentMoveCanvasHeight : number = move.canvas?.canvasHeight as number;
    const currentCanvasHeight : number = gameBoardComponent.canvas?.height as number;
    const currentCanvasWidth : number = gameBoardComponent.canvas?.width as number;
    let shouldMultiply : boolean = false;
    let ratioX : number = sentMoveCanvasWidth / currentCanvasWidth;
    let ratioY : number = sentMoveCanvasHeight / currentCanvasHeight;

    if (sentMoveCanvasWidth < currentCanvasWidth) {
      shouldMultiply = true;
      ratioX = currentCanvasWidth / sentMoveCanvasWidth;
      ratioY = currentCanvasHeight / sentMoveCanvasHeight;
    }

    let x : number = move.position.x;
    let y : number = move.position.y;

    if (shouldMultiply) {

      x *= ratioX;
      y *= ratioY;
    }
    else {
      x /= ratioX;
      y /= ratioY;
    }

    return {
      x,
      y
    };
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

  sendMove(move : Move) : void {
    this.hubConnection?.invoke('SendMove', move).catch((err : any) => { console.error(err);  }) ;
  }

  sendWord(word : Word) : void {
    this.hubConnection?.invoke('SendChosenWord', word.word);
  }

  sendUncoveredLetter(letter : string, letterPoistion : number) {
    this.hubConnection?.invoke('SendUncoveredLetter', letter, letterPoistion);
  }
}
