import { ElementRef } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-points-board',
  templateUrl: './points-board.component.html',
  styleUrls: ['./points-board.component.scss']
})
export class PointsBoardComponent implements OnInit, AfterViewInit {

  @ViewChild("pointsBoard") pointsBoard? : ElementRef<HTMLDivElement>;

  constructor(private chatservice : ChatService) { }

  ngAfterViewInit(): void {
    
  }

  ngOnInit() {
  }

}
