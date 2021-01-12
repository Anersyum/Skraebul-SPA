import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Position } from '../_models/Position';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {

  @ViewChild("myCanvas") canvasElement? : ElementRef<HTMLCanvasElement>;
  @ViewChild("colorContainer") colorsContainerElement? : ElementRef<HTMLDivElement>;
  isDrawing = false;
  canvas? : HTMLCanvasElement;
  color = "black";
  colorsContanier? : HTMLDivElement;
  context? : CanvasRenderingContext2D;
  xOffset = 0;
  yOffset = 0;
  move = 0;
  
  // 0 - start 1 - drawing 2 - end 3 - clear board
  undoStack : Array<Array<Position>> = [];
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.canvas = this.canvasElement?.nativeElement;
    this.colorsContanier = this.colorsContainerElement?.nativeElement;

    this.canvas!.width = window.innerWidth / 2;
    this.canvas!.height = window.innerHeight / 2;

    this.xOffset = this.canvas!.width / 2 + (this.colorsContanier!.clientWidth / 2);
    this.yOffset = this.canvas!.height / 2;

    this.context = this.canvas?.getContext("2d")!;
  }

  initializePen() {

    this.context!.lineWidth = 5;
    this.context!.lineCap = "round";
    this.context!.strokeStyle = this.color;

  }

  startDrawing(e: MouseEvent) {

    this.context!.moveTo(e.clientX - this.xOffset, e.clientY - this.yOffset);

    const lastX : number = e.clientX - this.xOffset;
    const lastY : number = e.clientY - this.yOffset;

    const points : Position = {
      x: lastX,
      y: lastY,
      drawing: 0,
      brushColor: this.context?.strokeStyle,
      brushWidth: this.context?.lineCap
    };

    this.addToDrawingStack(points);

    this.isDrawing = true;

    this.initializePen();
    
    this.context?.beginPath();
    
    this.draw(e);
  }

  draw(e: MouseEvent) {

    if (this.isDrawing) {
      
      this.context?.lineTo(e.clientX - this.xOffset, e.clientY - this.yOffset);
      this.context?.stroke();

      const lastX : number = e.clientX - this.xOffset;
      const lastY : number = e.clientY - this.yOffset;

      const points : Position = {
        x: lastX,
        y: lastY,
        drawing: 1,
        brushColor: this.context?.strokeStyle,
        brushWidth: this.context?.lineCap
      };

      this.addToDrawingStack(points);
    }
  }

  stopDrawing(e : MouseEvent) {

    const lastX : number = e.clientX - this.xOffset;
    const lastY : number = e.clientY - this.yOffset;

    const points : Position = {
      x: lastX,
      y: lastY,
      drawing: 2,
      brushColor: this.context?.strokeStyle,
      brushWidth: this.context?.lineCap
    };

    this.addToDrawingStack(points);

    this.isDrawing = false;
  }

  changePenColor(event : MouseEvent) {
    
    const element : HTMLButtonElement = event.target as HTMLButtonElement;

    this.color = element.dataset.color!;
  }

  clearBoard(isUndo : boolean = false) {

    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    if (this.undoStack.length > 0 && !isUndo) {
      this.addToDrawingStack({
        x: 0,
        y: 0,
        drawing: 3,
        brushColor: this.context?.strokeStyle,
        brushWidth: this.context?.lineCap
      });
    }
  }

  // do it a bit better
  undo() {
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
  }

  private addToDrawingStack(position: Position) {

    if (typeof this.undoStack[this.move] === "undefined") {
      this.undoStack.push([]);
    }

    this.undoStack[this.move].push(position);

    if (position.drawing === 2 || position.drawing === 3) {
      this.move++;
    }
  }

  private removeFromDrawingStack() {
    this.undoStack.pop();
  }

  private redrawDrawingStack() {

    const me : GameBoardComponent = this;
    let stopDrawing : boolean = false;

    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      const element : Array<Position> = this.undoStack[i];
      
      element.forEach((e : Position) => {
        if (e.drawing == 0){
          me.context?.moveTo(e.x, e.y);
          me.context?.beginPath();
        }
        else if (e.drawing == 1) {
          // console.log(e.x, e.y)
          me.context?.lineTo(e.x, e.y);
          me.context?.stroke();
        }
        else if (e.drawing == 3) {
          stopDrawing = true;
          return;
        }
      });

      if (stopDrawing) {
        break;
      }
    }
  }

  private emptyDrawingStack() {
    this.undoStack = [];
  }
}
