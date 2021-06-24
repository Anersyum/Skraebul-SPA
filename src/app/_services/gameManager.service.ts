import { Injectable } from '@angular/core';
import { Message } from '../_models/Message';
import { Player } from '../_models/Player';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  private players : Array<Player> | null = null;
  player? : Player;
  message? : Message;
  drawing : boolean = true;

  constructor() { }
  
  setPlayers(players : Array<Player>) : void {
    this.players = players;
  }

  getPlayers() : Array<Player> | null {
    return this.players;
  }
}
