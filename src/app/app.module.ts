import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { WordContanerComponent } from './game-board/word-contaner/word-contaner.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ChatWindowComponent } from './game-board/chat-window/chat-window.component';
import { HomeComponent } from './home/home.component';
import { PointsBoardComponent } from './game-board/points-board/points-board.component';
import { WordChoiceComponent } from './game-board/word-choice/word-choice.component';
import { CreateBubbleDirective } from './_customDirectives/createBubble.directive';
import { EndRoundPointsComponent } from './game-board/end-round-points/end-round-points.component';
import { CreateRoomComponent } from './home/create-room/create-room.component';

@NgModule({
  declarations: [
    // components
    AppComponent,
    GameBoardComponent,
    WordContanerComponent,
    ChatWindowComponent,
    HomeComponent,
    PointsBoardComponent,
    WordChoiceComponent,
    EndRoundPointsComponent,
    CreateRoomComponent,
    // directives
    CreateBubbleDirective
   ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  exports: [],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
