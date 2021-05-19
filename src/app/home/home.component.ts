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

  onPlay(input : HTMLInputElement) {
    
    this.userservice.setName(input.value);
    this.router.navigateByUrl("/gameboard");
  }
}
