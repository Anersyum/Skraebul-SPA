import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../_models/Word';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Guess_wordService {

  route : string = environment.url + "/words"
  constructor(private http: HttpClient) { }

  getWord() : Observable<Array<Word>>
  {
    return this.http.get<Array<Word>>(this.route);
  }
}
