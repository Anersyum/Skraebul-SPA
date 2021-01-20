import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Color } from '../_models/Color';
import { Position } from '../_models/Position';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {

  @ViewChild("myCanvas") canvasElement? : ElementRef<HTMLCanvasElement>;
  @ViewChild("colorContainer") colorsContainerElement? : ElementRef<HTMLDivElement>;
  @ViewChild("boardControlContainer") boardControlBtnsContainer? : ElementRef<HTMLDivElement>;
  isDrawing : boolean = false;
  canvas? : HTMLCanvasElement;
  color : string = "black";
  brushWidth : number = 5;
  colorsContanier? : HTMLDivElement;
  context? : CanvasRenderingContext2D;
  xOffset : number = 0;
  yOffset : number = 0;
  move : number = 0;
  penColorsArray : Array<string> = ["yellow", "red", "black", "green", "#ffffff"];
  penColors? : Array<Color> = [];
  selectedColor? : string;

  // 0 - start 1 - drawing 2 - end 3 - clear board
  undoStack : Array<Array<Position>> = [];

  constructor() { }

  ngOnInit() {
    this.penColorsArray.forEach((color : string) => {

      const colorObject : Color = {
        name : color,
        isActive : (color == "black") ? true : false // black is the default color
      };

      this.penColors?.push(colorObject);
    });
  }

  ngAfterViewInit() {

    this.canvas = this.canvasElement?.nativeElement;
    this.colorsContanier = this.colorsContainerElement?.nativeElement;

    this.canvas!.width = window.innerWidth / 2;
    this.canvas!.height = window.innerHeight / 1.5;

    this.xOffset = this.canvas!.getClientRects()[0].x;
    this.yOffset = this.canvas!.getClientRects()[0].y;

    this.context = this.canvas?.getContext("2d")!;
  }

  initializePen() {

    this.context!.lineWidth = this.brushWidth;
    this.context!.lineCap = "round";
    this.context!.strokeStyle = this.color;

  }

  startDrawing(e: MouseEvent) {

    this.initializePen();

    this.context!.moveTo(e.clientX - this.xOffset, e.clientY - this.yOffset);

    const lastX : number = e.clientX - this.xOffset;
    const lastY : number = e.clientY - this.yOffset;

    const points : Position = {
      x: lastX,
      y: lastY,
      drawing: 0,
      brushColor: this.context?.strokeStyle,
      brushWidth: this.context?.lineWidth
    };

    this.addToDrawingStack(points);

    this.isDrawing = true;
    
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
        brushWidth: this.context?.lineWidth
      };

      this.addToDrawingStack(points);
    }
  }

  stopDrawing(e : MouseEvent) {

    const lastX : number = e.clientX - this.xOffset;
    const lastY : number = e.clientY - this.yOffset;

    if (!this.isDrawing) {
      return;
    }

    const points : Position = {
      x: lastX,
      y: lastY,
      drawing: 2,
      brushColor: this.context?.strokeStyle,
      brushWidth: this.context?.lineWidth
    };

    this.addToDrawingStack(points);
    this.isDrawing = false;
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
      this.addToDrawingStack({
        x: 0,
        y: 0,
        drawing: 3,
        brushColor: this.context?.strokeStyle,
        brushWidth: this.context?.lineWidth
      });
    }
  }

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
      // we add a new empty array to the 2D array model so that we can store point objects in it
      this.undoStack.push([]);
    }

    this.undoStack[this.move].push(position);

    // we increase a players move only when the player has stopped drawing or cleared the board
    if (position.drawing === 2 || position.drawing === 3) {
      this.move++;
    }
  }

  private removeFromDrawingStack() {
    this.undoStack.pop();
  }

  private redrawDrawingStack() {

    const me : GameBoardComponent = this;

    for (let i = 0; i < me.undoStack.length; i++) {
      const element : Array<Position> = this.undoStack[i];
      
      element.forEach((e : Position) => {
        if (e.drawing == 0){

          me.color = e.brushColor as string;
          me.brushWidth = this.context?.lineWidth as number;
          me.initializePen();

          me.context?.moveTo(e.x, e.y);
          me.context?.beginPath();
        }
        else if (e.drawing == 1) {
          me.context?.lineTo(e.x, e.y);
          me.context?.stroke();
        }
        else if (e.drawing == 3) {
          this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
        }
      });
    }

    me.color = me.selectedColor as string;
  }

  private emptyDrawingStack() {
    this.undoStack = [];
  }
}