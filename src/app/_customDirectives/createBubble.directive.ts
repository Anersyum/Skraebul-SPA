import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '../_models/Message';
import { Player } from '../_models/Player';

@Directive({
  selector: '[appCreateBubble]'
})
export class CreateBubbleDirective implements OnChanges {

  @Input() appCreateBubble? : Player | Message;

  constructor(private el : ElementRef<HTMLDivElement>) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appCreateBubble && changes.appCreateBubble.currentValue) {
      let p : HTMLParagraphElement;

      if (this.isMessage(this.appCreateBubble)) {
        
        if (this.appCreateBubble.correctAnswer) {
          p = this.createGuessedCorrectlyBubble();
        }
        else {
          p = this.createChatBubble(this.appCreateBubble);
        }
        
        this.el.nativeElement.appendChild(p);
        this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
        return;
      }

      p = this.createConnectedBubble(this.appCreateBubble as Player);
      this.el.nativeElement.appendChild(p);
    }
  }

  private isMessage(message? : Player | Message) : message is Message {
    return (message as Message).message != undefined;
  }

  private createChatBubble(message : Message) : HTMLParagraphElement {

    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const br = document.createElement('br');
    const span = document.createElement('span');

    strong.innerText = message.username + ':';
    span.innerText = message.message;
    
    p.appendChild(strong);
    p.appendChild(br);
    p.appendChild(span);

    p.style.margin = '0';
    p.style.padding = '0';
    p.style.marginBottom = '5px';

    return p;
  }

  private createConnectedBubble(player : Player) : HTMLParagraphElement {
    const p : HTMLParagraphElement = document.createElement('p');
    const connectedMessage : string = (player.loggedIn) ? ' connected!' : ' disconnected!';
    p.innerText = player.username + ' ' + connectedMessage;

    return p;
  }

  private createGuessedCorrectlyBubble(): HTMLParagraphElement {
    
    const p = document.createElement('p');
    
    p.innerText = 'You guessed correctly!';
    p.style.color = 'green';

    return p;
  }
}
