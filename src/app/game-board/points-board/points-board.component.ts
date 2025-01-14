import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GameManagerService } from 'src/app/_services/gameManager.service';

@Component({
  selector: 'app-points-board',
  templateUrl: './points-board.component.html',
  styleUrls: ['./points-board.component.scss'],
  standalone: false
})
export class PointsBoardComponent implements OnInit, AfterViewInit {

  constructor(public gameManagerService : GameManagerService) { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {}
}
