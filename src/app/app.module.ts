import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { WordContanerComponent } from './game-board/word-contaner/word-contaner.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatWindowComponent } from './game-board/chat-window/chat-window.component';
import { HomeComponent } from './home/home.component';
import { PointsBoardComponent } from './game-board/points-board/points-board.component';
import { WordChoiceComponent } from './game-board/word-choice/word-choice.component';

@NgModule({
  declarations: [		
    AppComponent,
    GameBoardComponent,
    WordContanerComponent,
    ChatWindowComponent,
    HomeComponent,
    PointsBoardComponent,
    WordChoiceComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
