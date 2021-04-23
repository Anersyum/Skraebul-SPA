import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../_models/Word';
@Injectable({
  providedIn: 'root'
})
export class Guess_wordService {

  route : string = "http://localhost:5000/words"
  constructor(private http: HttpClient) { }

  getWord() : Observable<Word>
 {
    return this.http.get<Word>(this.route);
  }
}
