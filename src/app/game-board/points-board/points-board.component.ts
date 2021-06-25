import { Input } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GameManagerService } from 'src/app/_services/gameManager.service';

@Component({
  selector: 'app-points-board',
  templateUrl: './points-board.component.html',
  styleUrls: ['./points-board.component.scss']
})
export class PointsBoardComponent implements OnInit, AfterViewInit {

  @Input("gameManagerService") gameManagerService? : GameManagerService;

  constructor() { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {}
}
