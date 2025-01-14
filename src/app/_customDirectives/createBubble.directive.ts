import { Directive, EmbeddedViewRef, Input, OnChanges, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Message } from '../_models/Message';
import { Player } from '../_models/Player';

@Directive({
  selector: '[appCreateBubble]',
  standalone: false
})
export class CreateBubbleDirective implements OnChanges {

  @Input() appCreateBubble? : Player | Message;

  constructor(private template : TemplateRef<any>, private container : ViewContainerRef, private renderer : Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appCreateBubble && changes.appCreateBubble.currentValue) {
      this.createCorrectBubble();
    }
  }

  private createCorrectBubble() {
    if (this.isMessage(this.appCreateBubble)) {

      if (this.appCreateBubble.correctAnswer) {
        this.createGuessedCorrectlyBubble();
      }
      else {
        this.createChatBubble(this.appCreateBubble);
      }

      this.container.element.nativeElement.scrollTop = this.container.element.nativeElement.scrollHeight;
      return;
    }

    this.createConnectedBubble(this.appCreateBubble as Player);
  }

  private isMessage(message? : Player | Message) : message is Message {

    return (message as Message).message != undefined;
  }

  private createChatBubble(message : Message) : void {

    const view : EmbeddedViewRef<any> = this.template!.createEmbeddedView(null);
    const p : HTMLParagraphElement= view?.rootNodes[0];
    const strong : HTMLSpanElement = p.children[0] as HTMLSpanElement;
    const span : HTMLSpanElement= p.children[2] as HTMLSpanElement;

    strong.innerText = message.username + ':';
    span.innerText = message.message;

    p.style.margin = '0';
    p.style.padding = '0';
    p.style.marginBottom = '5px';
    this.renderer.removeClass(p, "hide");

    this.container.insert(view!);
  }

  private createConnectedBubble(player : Player) : void {

    const view : EmbeddedViewRef<any> = this.template!.createEmbeddedView(null);
    const p : HTMLParagraphElement= view?.rootNodes[0];
    const connectedMessage : string = (player.loggedIn) ? ' connected!' : ' disconnected!';

    p.innerText = player.username + ' ' + connectedMessage;
    this.renderer.removeClass(p, "hide");
    this.renderer.removeClass(p, "chat-message");

    this.container.insert(view!);
  }

  private createGuessedCorrectlyBubble(): void {

    const view = this.template?.createEmbeddedView(null);
    const p : HTMLParagraphElement = view?.rootNodes[1];

    p.innerText = 'You guessed correctly!';
    this.renderer.removeClass(p, "hide");
    this.renderer.addClass(p, "correct-answer")

    this.container.insert(view!);
  }
}
