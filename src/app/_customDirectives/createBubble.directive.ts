import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Player } from '../_models/Player';

@Directive({
  selector: '[appCreateBubble]'
})
export class CreateBubbleDirective implements OnChanges {

  @Input() appCreateBubble? : Player;

  constructor(private el : ElementRef<HTMLDivElement>) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appCreateBubble) {
      const p = document.createElement('p');
      if (this.appCreateBubble?.loggedIn) {
        p.innerText = this.appCreateBubble.username + ' connected!';
        this.el.nativeElement.appendChild(p);
      }
      else if (this.appCreateBubble?.loggedIn === false) {
        p.innerText = this.appCreateBubble.username + ' disconnected!';
        this.el.nativeElement.appendChild(p);
      }
    }
  }
}
