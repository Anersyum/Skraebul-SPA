import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  roomNumber : number = 0;
  joinRoom : boolean = false;
  
  constructor() { }

  getName() : string {
    return localStorage.getItem('username') ?? '';
  }

  setName(username : string) : void {
    localStorage.setItem('username', username);
  }

  deleteName() : void {
    localStorage.removeItem('username');
  }
}
