import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Brush } from '../_models/Brush';
import { Canvas } from '../_models/Canvas';
import { Color } from '../_models/Color';
import { Move } from '../_models/Move';
import { Position } from '../_models/Position';
import { Thickness } from '../_models/Thickness';
import { Word } from '../_models/Word';
import { GameService } from '../_services/game.service';
import { Guess_wordService } from '../_services/guess_word.service';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { PointsBoardComponent } from './points-board/points-board.component';
import { WordContanerComponent } from './word-contaner/word-contaner.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("myCanvas") canvasElement? : ElementRef<HTMLCanvasElement>;
  @ViewChild("colorContainer") colorsContainerElement? : ElementRef<HTMLDivElement>;
  @ViewChild("boardControlContainer") boardControlBtnsContainer? : ElementRef<HTMLDivElement>;
  @ViewChild("chatWindowComponent") chatWindowComponent? : ChatWindowComponent;
  @ViewChild("pointsBoardComponent") pointsBoardComponent? : PointsBoardComponent;
  @ViewChild("wordContainerComponent") wordContainerComponent? : WordContanerComponent
  chatBoxHeight : number = 0;
  wordContainerWidth : number = 0;
  isDrawing : boolean = false;
  canDraw : boolean = false;
  canStartGame : boolean = false;
  canvas? : HTMLCanvasElement;
  color : string = "black";
  brushWidth : number = 5;
  colorsContanier? : HTMLDivElement;
  context? : CanvasRenderingContext2D;
  xOffset : number = 0;
  yOffset : number = 0;
  move : number = 0;
  penColorsArray : Array<string> = ["yellow", "red", "black", "green", "#ffffff"];
  penColors : Array<Color> = [];
  selectedColor? : string;
  penThicknessArray : Array<number> = [5, 7, 10, 12, 15];
  penThickness : Array<Thickness> = [];
  selectedThickness? : number;
  // 0 - start 1 - drawing 2 - end 3 - clear board
  undoStack : Array<Array<Move>> = [];

  constructor(public gameService : GameService, private wordService: Guess_wordService) { }
  
  ngOnDestroy(): void {
    this.gameService.disconnect();
  }

  ngOnInit() {
    this.gameService.connect();
    this.penColorsArray.forEach((color : string) => {

      const colorObject : Color = {
        name : color,
        isActive : (color == "black") ? true : false // black is the default color
      };

      this.penColors?.push(colorObject);
    });

    this.penThicknessArray.forEach((thickness : number) => {

      const thicknessObject : Thickness = {
        value: thickness,
        isActive: (thickness === 5) ? true : false
      };

      if (thicknessObject.isActive) {
        this.selectedThickness = thicknessObject.value;
      }

      this.penThickness?.push(thicknessObject);

      this.wordContainerWidth = window.innerWidth / 2;
      this.chatBoxHeight = window.innerHeight / 1.5
    });
  }

  ngAfterViewInit() {

    this.canvas = this.canvasElement?.nativeElement;
    this.colorsContanier = this.colorsContainerElement?.nativeElement;

    this.createCanvasDimensions();

    this.context = this.canvas?.getContext("2d")!;

    this.gameService.registerEvents(this.chatWindowComponent?.chatbox?.nativeElement,
      this.pointsBoardComponent?.pointsBoard?.nativeElement, this, this.wordContainerComponent as WordContanerComponent);

    this.gameService.startConnection();
  }

  private createCanvasDimensions() {
    this.canvas!.width = window.innerWidth / 2;
    this.canvas!.height = window.innerHeight / 1.5;

    this.xOffset = this.canvas!.getClientRects()[0].x;
    this.yOffset = this.canvas!.getClientRects()[0].y;
  }

  onResize() {
    this.wordContainerWidth = 0;
    this.chatBoxHeight = 0;

    this.createCanvasDimensions();

    this.wordContainerWidth = this.canvas!.width;
    this.chatBoxHeight = this.canvas!.height;
  }

  initializePen() {

    this.context!.lineWidth = this.brushWidth;
    this.context!.lineCap = "round";
    this.context!.strokeStyle = this.color;

  }

  startDrawing(e: MouseEvent | TouchEvent) {

    if (!this.canDraw) {
      return;
    }

    this.initializePen();

    const eventCoordinates : Position = this.getEventCoordinates(e);
    const offsetCoordinates : Position = {
      x: eventCoordinates.x - this.xOffset,
      y: eventCoordinates.y - this.yOffset 
    };
    
    this.context!.moveTo(offsetCoordinates.x, offsetCoordinates.y);
    
    const brush : Brush = {
      brushColor: this.context?.strokeStyle,
      brushWidth: this.context?.lineWidth
    };

    const points : Move = {
      position: offsetCoordinates,
      drawing: 0,
      brush,
      isUndo: false
    };

    this.addToDrawingStack(points);

    this.isDrawing = true;
    
    this.context?.beginPath();
    
    this.gameService.sendMove({
      position: eventCoordinates,
      drawing: points.drawing,
      brush: points.brush,
      canvas: {
        canvasHeight: this.canvas?.height as number,
        canvasWidth: this.canvas?.width as number
      },
      isUndo: false
    });

    this.draw(e);
  }

  private isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    if (event && (event as TouchEvent).touches) {
      return 'touches' in event;
    }
    return false;
  }

  draw(e: MouseEvent | TouchEvent) {

    if (!this.canDraw) {
      return;
    }

    const eventCoordinates : Position = this.getEventCoordinates(e);
    const offsetCoordinates : Position = {
      x: eventCoordinates.x - this.xOffset,
      y: eventCoordinates.y - this.yOffset 
    };

    if (this.isDrawing) {
      
      this.context?.lineTo(offsetCoordinates.x, offsetCoordinates.y);
      this.context?.stroke();

      const brush : Brush = {
        brushColor: this.context?.strokeStyle,
        brushWidth: this.context?.lineWidth
      };
  
      const points : Move = {
        position: offsetCoordinates,
        drawing: 1,
        brush,
        isUndo: false
      };

      this.addToDrawingStack(points);
      this.gameService.sendMove({
        position: eventCoordinates,
        drawing: points.drawing,
        brush: points.brush,
        canvas: {
          canvasHeight: this.canvas?.height as number,
          canvasWidth: this.canvas?.width as number
        },
        isUndo: false
      });
    }
  }

  stopDrawing(e : MouseEvent | TouchEvent) {

    if (!this.canDraw) {
      return;
    }

    const eventCoordinates : Position = this.getEventCoordinates(e);
    const offsetCoordinates : Position = {
      x: eventCoordinates.x - this.xOffset,
      y: eventCoordinates.y - this.yOffset 
    };

    if (!this.isDrawing) {
      return;
    }

    const brush : Brush = {
      brushColor: this.context?.strokeStyle,
      brushWidth: this.context?.lineWidth
    };

    const points : Move = {
      position: offsetCoordinates,
      drawing: 2,
      brush,
      isUndo: false
    };

    this.addToDrawingStack(points);
    this.isDrawing = false;
    this.gameService.sendMove({
      position: eventCoordinates,
      drawing: points.drawing,
      brush: points.brush,
      canvas: {
        canvasHeight: this.canvas?.height as number,
        canvasWidth: this.canvas?.width as number
      },
      isUndo: false
    });
  }

  private getEventCoordinates(e : MouseEvent | TouchEvent) : Position {

    let clientX : number = 0;
    let clientY : number = 0;

    if (!this.isTouchEvent(e)) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: clientX,
      y: clientY
    };
  }

  changePenColor(event : MouseEvent, color : Color) {
    
    const element : HTMLAnchorElement = event.target as HTMLAnchorElement;

    this.color = element.dataset.color!;

    this.penColors?.forEach((color : Color) => {
      color.isActive = false;
    });

    color.isActive = true;

    this.selectedColor = color.name;
  }

  clearBoard(isUndo : boolean = false) {

    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    if (this.undoStack.length > 0 && !isUndo) {
      const position : Position = {
        x: 0,
        y: 0
      };

      const brush : Brush = {
        brushColor: this.context?.strokeStyle,
        brushWidth: this.brushWidth
      };

      const canvas : Canvas = {
        canvasWidth: this.canvas?.width as number,
        canvasHeight: this.canvas?.height as number,
      };

      const move : Move = {
        position,
        drawing: 3,
        brush,
        isUndo: false
      };

      this.addToDrawingStack(move);

      this.gameService.sendMove({
        position,
        drawing: 3,
        brush,
        canvas,
        isUndo: false
      });
    }
  }

  undo(isSentMove : boolean) {
    this.removeFromDrawingStack();

    if (this.undoStack.length <= 0) {
      this.move = 0;
    }
    else {
      this.move--;
    }

    const isUndo : boolean = true;

    this.clearBoard(isUndo);
    this.redrawDrawingStack();
    
    if (!isSentMove) {
      this.gameService.sendMove({
        position: { x: 0, y: 0},
        drawing: 4,
        brush: { brushColor: "", brushWidth: 0 },
        canvas: { canvasHeight: 0, canvasWidth: 0},
        isUndo: true
      });
    }
  }

  public addToDrawingStack(move: Move) {

    if (typeof this.undoStack[this.move] === "undefined") {
      // we add a new empty array to the 2D array model so that we can store point objects in it
      this.undoStack.push([]);
    }

    this.undoStack[this.move].push(move);

    // we increase a players move only when the player has stopped drawing or cleared the board
    if (move.drawing === 2 || move.drawing === 3) {
      this.move++;
    }
  }

  private removeFromDrawingStack() {
    this.undoStack.pop();
  }

  private redrawDrawingStack() {

    const me : GameBoardComponent = this;

    for (let i = 0; i < me.undoStack.length; i++) {
      const element : Array<Move> = this.undoStack[i];
      
      element.forEach((e : Move) => {
        if (e.drawing == 0){

          me.color = e.brush.brushColor as string;
          me.brushWidth = e.brush.brushWidth as number;
          me.initializePen();

          me.context?.moveTo(e.position.x, e.position.y);
          me.context?.beginPath();
        }
        else if (e.drawing == 1) {
          me.context?.lineTo(e.position.x, e.position.y);
          me.context?.stroke();
        }
        else if (e.drawing == 3) {
          this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
        }
      });
    }

    me.color = me.selectedColor as string;
    me.brushWidth = me.selectedThickness as number;
  }

  changeBrushSize(penThickness : Thickness) {
    
    this.penThickness?.forEach((thickness : Thickness) => {
      thickness.isActive = false;
    });

    penThickness.isActive = true;

    this.brushWidth = this.selectedThickness = penThickness.value;
  }

  startGame() : void {
    this.canDraw = true;
    let gottenWord : Word;

    this.wordService.getWord().subscribe((x : Word) => {
      
      gottenWord = x;
      this.gameService.sendWord(gottenWord);
      this.wordContainerComponent?.hideWord(gottenWord, true);
    });
  }
}