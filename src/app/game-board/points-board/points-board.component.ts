import { ElementRef } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-points-board',
  templateUrl: './points-board.component.html',
  styleUrls: ['./points-board.component.scss']
})
export class PointsBoardComponent implements OnInit, AfterViewInit {

  @ViewChild("pointsBoard") pointsBoard? : ElementRef<HTMLDivElement>;

  constructor() { }

  ngAfterViewInit(): void {
    
  }

  ngOnInit() {
  }

}
