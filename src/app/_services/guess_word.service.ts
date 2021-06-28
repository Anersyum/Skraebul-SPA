import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Guess_wordService implements OnDestroy {

  route : string = environment.url + "/words"
  constructor(private http: HttpClient) { }
  ngOnDestroy(): void {
    alert("destroyx")
  }

  getWord() : Observable<Array<string>>
  {
    return this.http.get<Array<string>>(this.route);
  }
}
