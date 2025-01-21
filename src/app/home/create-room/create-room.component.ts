import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomInfo } from 'src/app/_models/RoomInfo';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  standalone: false
})
export class CreateRoomComponent implements OnInit {

  isPasswordChecked : boolean = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() createRoomEvent = new EventEmitter<RoomInfo>();
  protected roomName: string = '';
  protected password: string = '';

  constructor() { }

  ngOnInit() {
  }

  enablePassword() {
    this.isPasswordChecked = !this.isPasswordChecked;
  }

  createRoom(hasPassword : boolean) {

    if (this.roomName == '') return;

    const roomInfo = {
      roomName: this.roomName,
      password: ''
    }

    if (hasPassword && this.password == '') {
      // todo: add error message
      return;
    }

    roomInfo.password = this.password;

    this.createRoomEvent.emit(roomInfo);
  }

  closeModal() {
    this.closeModalEvent.emit(true);
  }
}
