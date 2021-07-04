import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username : string = "";
  constructor(private userservice : UserService, private router : Router) { }

  ngOnInit() {
    this.username = this.userservice.getName();
  }

  onCreateRoom(input : HTMLInputElement) {
    
    if (input.value == '') {
      return;
    }

    this.userservice.setName(input.value);
    this.router.navigateByUrl("/gameboard");
  }

  onJoinRoom(input : HTMLInputElement, roomNumber : HTMLInputElement) {

    if (input.value == '' || roomNumber.value == '') {
      return;
    }

    this.userservice.roomNumber = (roomNumber.value as unknown) as number;
    console.log(this.userservice.roomNumber);
    this.userservice.joinRoom = true;
    this.userservice.setName(input.value);
    this.router.navigateByUrl("/gameboard");
  }
}
