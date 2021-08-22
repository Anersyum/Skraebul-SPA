import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomInfo } from 'src/app/_models/RoomInfo';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  isPasswordChecked : boolean = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() createRoomEvent = new EventEmitter<RoomInfo>();

  constructor() { }

  ngOnInit() {
  }

  enablePassword() {
    this.isPasswordChecked = !this.isPasswordChecked;
  }

  createRoom(roomName : string, hasPassword : boolean, password : string) {

    if (roomName == '') return;

    const roomInfo = {
      roomName,
      password: ''
    }

    if (hasPassword) {
      roomInfo.password = password
    }

    this.createRoomEvent.emit(roomInfo);
  } 

  closeModal() {
    this.closeModalEvent.emit(true);
  }
}
