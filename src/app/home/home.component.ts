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

  constructor(private userservice : UserService, private router : Router) { }

  ngOnInit() {
    this.username = this.userservice.getName();
    this.userservice.joinRoom = false;
  }

  createRoom(event : RoomInfo, username : string) {

    if (event.roomName == '') return;
    if (!this.username) return; //todo: add an error message

    this.userservice.setName(username);
    this.userservice.roomName = event.roomName;
    this.router.navigateByUrl("/gameboard");
  }

  onJoinRoom(input : HTMLInputElement, roomNumber : HTMLInputElement) {

    if (input.value == '' || roomNumber.value == '') {
      return;
    }

    this.userservice.roomName = (roomNumber.value as unknown) as string;
    console.log(this.userservice.roomName);
    this.userservice.joinRoom = true;
    this.userservice.setName(input.value);
    this.router.navigateByUrl("/gameboard");
  }

  showCreateRoomWindow() {
    this.isCreatingRoom = true;
  }

  closeCreateRoomModal(event : boolean) {
    this.isCreatingRoom = !event
  }
}
