import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Guess_wordService {

  route : string = environment.url + "/words"
  constructor(private http: HttpClient) { }

  /**
   * Gets selected words from the API
   * @returns Observable<Array<string>>
   */
  getWord() : Observable<Array<string>>
  {
    return this.http.get<Array<string>>(this.route);
  }
}
