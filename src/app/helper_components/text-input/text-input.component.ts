import { Component, input, InputSignal, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  standalone: false
})
export class TextInputComponent {

  public placeHolderText: InputSignal<string> = input('');
  public disabled: InputSignal<boolean> = input(false);
  @Output() value: EventEmitter<string> = new EventEmitter<string>();

  protected emmitValue(inputValue: string): void{
    this.value.emit(inputValue);
  }
}
