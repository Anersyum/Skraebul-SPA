import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomInfo } from '../_models/RoomInfo';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {

  username : string = "";
  isCreatingRoom : boolean = false;
  protected roomNumber: string = '';

  constructor(private userservice : UserService, private router : Router) { }

  ngOnInit() {
    this.username = this.userservice.getName();
    this.userservice.joinRoom = false;
  }

  createRoom(event : RoomInfo) {
    if (event.roomName == '') return;
    if (!this.username) return; //todo: add an error message

    this.userservice.setName(this.username);
    this.userservice.roomName = event.roomName;
    this.router.navigateByUrl("/gameboard");
  }

  setUsername(username: string) {
    this.username = username;
  }

  setRoomNumber(roomNumber: string) {
    this.roomNumber = roomNumber;
  }

  joinRoom() {
    if (this.username == '' || this.roomNumber == '') {
      return;
    }

    this.userservice.roomName = this.roomNumber;
    console.log(this.userservice.roomName);
    this.userservice.joinRoom = true;
    this.userservice.setName(this.username);
    this.router.navigateByUrl("/gameboard");
  }

  showCreateRoomWindow() {
    this.isCreatingRoom = true;
  }

  closeCreateRoomModal(event : boolean) {
    this.isCreatingRoom = !event
  }
}
