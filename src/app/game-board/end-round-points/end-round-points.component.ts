import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/_models/Player';
import { GameManagerService } from 'src/app/_services/gameManager.service';

@Component({
  selector: 'app-end-round-points',
  templateUrl: './end-round-points.component.html',
  styleUrls: ['./end-round-points.component.scss']
})
export class EndRoundPointsComponent implements OnInit {

  players : Array<Player> = [];
  exampleData : Array<Player> = [
    {
      username: "Amor",
      points: 200,
      gottenPoints: 100,
    },
    {
      username: "Amor",
      points: 200,
      gottenPoints: 100,
    },
    {
      username: "Amor",
      points: 200,
      gottenPoints: 100,
    }
  ]
  constructor(private gameManagerService : GameManagerService) { }

  ngOnInit() {
    // this.players = this.gameManagerService.getPlayers() as Array<Player>;
    this.players = this.exampleData;
  }

}
