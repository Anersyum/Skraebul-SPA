import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  
  // 0 - start 1 - drawing 2 - end
  undoStack : Array<Array<Object>> = [];
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

    this.context?.save();

    this.context!.moveTo(e.clientX - this.xOffset, e.clientY - this.yOffset);

    const lastX = e.clientX - this.xOffset;
    const lastY = e.clientY - this.yOffset;

    const points : {
      x: number,
      y: number,
      drawing: number
    } = {
      x: lastX,
      y: lastY,
      drawing: 0
    };

    this.undoStack.push([]);
    this.undoStack[this.move].push(points);

    this.isDrawing = true;

    this.initializePen();

    this.context?.beginPath();
    this.draw(e);

  }

  draw(e: MouseEvent) {

    if (this.isDrawing) {
      
      this.context?.lineTo(e.clientX - this.xOffset, e.clientY - this.yOffset);
      this.context?.stroke();

      const lastX = e.clientX - this.xOffset;
      const lastY = e.clientY - this.yOffset;

      const points : {
        x: number,
        y: number,
        drawing: number
      } = {
        x: lastX,
        y: lastY,
        drawing: 1
      };

      this.undoStack[this.move].push(points);
    }
  }

  stopDrawing(e : MouseEvent) {

    const lastX = e.clientX - this.xOffset;
    const lastY = e.clientY - this.yOffset;

    const points : {
      x: number,
      y: number,
      drawing: number
    } = {
      x: lastX,
      y: lastY,
      drawing: 2
    };

    this.undoStack[this.move].push(points);

    this.move++;
    this.isDrawing = false;
  }

  changePenColor(event : MouseEvent) {
    
    const element = event.target as HTMLButtonElement;

    this.color = element.dataset.color!;
  }

  clearBoard() {

    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
  }

  // do it a bit better
  undo() {

    const me = this;

    this.clearBoard();

    this.undoStack.pop();
    this.move--;

    this.undoStack.forEach(function(el, index) {

      el.forEach((e) => {
        if (e.drawing == 0){
          me.context?.moveTo(e.x, e.y);
          me.context?.beginPath();
        }
        else if (e.drawing == 1) {
          console.log(e.x, e.y)
          me.context?.lineTo(e.x, e.y);
          me.context?.stroke();
        }
        else if (e.drawing == 2) {
  
        }
      })
    })
  }
}
