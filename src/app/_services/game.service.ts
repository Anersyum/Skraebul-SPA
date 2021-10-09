import { Position } from '../_models/Position';
import { Move } from '../_models/Move';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { GameBoardComponent } from '../game-board/game-board.component';
import { Message } from '../_models/Message';
import { UserService } from './user.service';
import { Player } from '../_models/Player';
import { environment } from 'src/environments/environment';
import { RoundInfo } from '../_models/RoundInfo';
import { GameManagerService } from './gameManager.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService{

  private hubConnection : HubConnection | null = null;

  constructor(private userservice : UserService, private gameManagerService: GameManagerService, private router : Router) {}

  connect() : void {
    let username = this.userservice.getName();
    const roomName : string = this.userservice.roomName;
    const isJoiningRoom : boolean = this.userservice.joinRoom;
    console.log(environment.url +'/chathub?username=' + username + '&room=' + roomName + '&joinRoom=' + isJoiningRoom);
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.url +'/chathub?username=' + username + '&room=' + roomName + '&joinroom=' + isJoiningRoom)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  /**
   * Registers all the events needed for the game.
   * @param gameBoardComponent
   */
  registerEvents(gameBoardComponent : GameBoardComponent) : void {
    
    this.hubConnection?.on('RecieveMessage', (message : Message) => {
      this.gameManagerService.message = message;
      this.gameManagerService.message.correctAnswer = false;
    });

    this.hubConnection?.on('Connected', (users : Array<Player>, username : string, roomName : string) => {
      this.gameManagerService.setPlayers(users);
      this.gameManagerService.player = {username : username, loggedIn : true};
      this.setAdmin(users);
      this.userservice.roomName = roomName;
    });

    this.hubConnection?.on('Disconnected', (users : Array<Player>, username : string) => {
      this.gameManagerService.setPlayers(users);
      this.gameManagerService.player = {username : username, loggedIn : false};
      this.setAdmin(users);
    });

    this.hubConnection?.on('FailedToConnect', (message : string) => {
      alert(message);
      this.router.navigateByUrl('/');
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
      let isAdmin : boolean = false;
      gameBoardComponent.clearBoard();
      this.gameManagerService.hideWord(word, isAdmin, this);
      this.gameManagerService.drawing = false;
    });

    this.hubConnection?.on('RecieveUncoveredLetter', (letter : string, letterPoistion : number) => {
      this.gameManagerService.uncoverLetter(letter, letterPoistion);
    });

    this.hubConnection?.on('RecieveAnswer', (roundInfo : RoundInfo, users : Array<Player>) => {
      if (roundInfo.isLastRound) {
        this.gameManagerService.finishGame();
        return;
      }
      this.gameManagerService.drawing = true;
      this.gameManagerService.setPlayers(users);
      this.gameManagerService.showEndRoundResults();
      // console.log(users);
      this.gameManagerService.finishRound();
      this.setAdmin(users);
      this.gameManagerService.disableTimer();
    });

    this.hubConnection?.on('RecieveAnswerMessage', (answer : string) => {
      this.gameManagerService.message = {
        username: '',
        message: '',
        correctAnswer: true
      };
      this.gameManagerService.word = answer;
    });

    this.hubConnection?.on('EndRoundViaTimer', (roundInfo : RoundInfo, users : Array<Player>) => {
      if (roundInfo.isLastRound) {
        this.gameManagerService.finishGame();
        return;
      }
      this.gameManagerService.drawing = true;
      this.gameManagerService.setPlayers(users);
      // console.log(users);
      this.gameManagerService.finishRound();
      this.setAdmin(users);
      this.gameManagerService.disableTimer();
    });
  }

  /**
   * Sets admin of the room so that the game can be started.
   * @param users 
   */
  private setAdmin(users : Array<Player>) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      if (user.username == this.userservice.getName()) {
        this.gameManagerService.canStartGame = user.isAdmin as boolean;
        this.gameManagerService.canDraw = false;
      }
    }
  }

  /**
   * Adapts coordinates to fit the transition from a larger resolution to a lower and vice versa.
   * @param gameBoardComponent 
   * @param move 
   * @returns Position
   */
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

  disconnect() : void {
    this.hubConnection?.stop();
    this.hubConnection = null;
    this.deregisterEvents();
  }

  deregisterEvents() : void {
    
    this.hubConnection?.off('RecieveMessage');
    this.hubConnection?.off('Connected');
    this.hubConnection?.off('Disconnected');
    this.hubConnection?.off("RecieveMove");
    this.hubConnection?.off('RecieveChosenWord');
    this.hubConnection?.off('RecieveUncoveredLetter');
    this.hubConnection?.off('RecieveAnswer');
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

  endRound() {
    this.hubConnection?.invoke('EndRoundViaTimer');
  }
}
