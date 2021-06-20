import { Injectable } from '@angular/core';
import { Player } from '../_models/Player';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  private players : Array<Player> | null = null;
  
  constructor() { }
  
  setPlayers(players : Array<Player>) : void {
    console.log(players);
    this.players = players;
  }

  getPlayers() : Array<Player> | null {
    return this.players;
  }
}
