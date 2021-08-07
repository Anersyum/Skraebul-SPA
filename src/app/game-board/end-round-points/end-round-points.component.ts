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
  
  constructor(private gameManagerService : GameManagerService) { }

  ngOnInit() {
    this.players = this.gameManagerService.getPlayers() as Array<Player>;
  }

}
