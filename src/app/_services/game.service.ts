import { Position } from '../_models/Position';
import { Move } from '../_models/Move';
import { Injectable, Output } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { GameBoardComponent } from '../game-board/game-board.component';
import { Message } from '../_models/Message';
import { UserService } from './user.service';
import { Player } from '../_models/Player';
import { WordContanerComponent } from '../game-board/word-contaner/word-contaner.component';
import { environment } from 'src/environments/environment';
import { RoundInfo } from '../_models/RoundInfo';
import { GameManagerService } from './gameManager.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private hubConnection : HubConnection | null = null;

  constructor(private userservice : UserService, private gameManagerService: GameManagerService) {}

  connect() : void {
    let username = this.userservice.getName();
    
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(environment.url +'/chathub?username=' + username)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
  }

  registerEvents(gameBoardComponent : GameBoardComponent, wordContainerComponent : WordContanerComponent) : void {
    
    this.hubConnection?.on('RecieveMessage', (message : Message) => {
      this.gameManagerService.message = message;
      this.gameManagerService.message.correctAnswer = false;
    });

    this.hubConnection?.on('Connected', (users : Array<Player>, username : string) => {
      this.gameManagerService.setPlayers(users);
      this.gameManagerService.player = {username : username, loggedIn : true};
      this.setAdmin(users, gameBoardComponent);
    });

    this.hubConnection?.on('Disconnected', (users : Array<Player>, username : string) => {
      this.gameManagerService.setPlayers(users);
      this.gameManagerService.player = {username : username, loggedIn : false};
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

    // todo: recieve word will recieve letters from the drawing player and the other players timers will not have timers for the word
    this.hubConnection?.on('RecieveChosenWord', (word : string) => {
      wordContainerComponent.hideWord(word, false);
      this.gameManagerService.drawing = false;
    });

    this.hubConnection?.on('RecieveUncoveredLetter', (letter : string, letterPoistion : number) => {
      wordContainerComponent.uncoverLetter(letter, letterPoistion);
    });

    this.hubConnection?.on('RecieveAnswer', (roundInfo : RoundInfo, users : Array<Player>) => {
      this.gameManagerService.drawing = true;
      if (roundInfo.isLastRound) {
        gameBoardComponent.finishGame();
        return;
      }
      this.gameManagerService.setPlayers(users);
      console.log(users);
      gameBoardComponent.clearBoardAndWord();
      this.setAdmin(users, gameBoardComponent);
      clearInterval(wordContainerComponent.timerInterval);
      wordContainerComponent.timer = 60;
    });

    this.hubConnection?.on('RecieveAnswerMessage', () => {
      this.gameManagerService.message = {
        username: '',
        message: '',
        correctAnswer: true
      };
    });
  }

  private setAdmin(users : Array<Player>, gameBoardComponent : GameBoardComponent) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      if (user.username == this.userservice.getName()) {
        gameBoardComponent.canStartGame = user.isAdmin as boolean;
        gameBoardComponent.canDraw = false;
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
  
  sendMessage(message : Message) : void {
    this.hubConnection?.invoke('SendMessage', message.username, message.message).catch((err : any) => { console.error(err.toString()); });
  }

  disconnect() : void {
    this.hubConnection?.stop();
  }

  sendMove(move : Move) : void {
    this.hubConnection?.invoke('SendMove', move).catch((err : any) => { console.error(err);  }) ;
  }

  sendWord(word : string) : void {
    this.hubConnection?.invoke('SendChosenWord', word);
  }

  sendUncoveredLetter(letter : string, letterPoistion : number) {
    this.hubConnection?.invoke('SendUncoveredLetter', letter, letterPoistion);
  }

  sendAnswer(answer : string, time : number) {
    this.hubConnection?.invoke('SendAnswer', answer, time);
  }
}
