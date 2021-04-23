/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WordContanerComponent } from './word-contaner.component';

describe('WordContanerComponent', () => {
  let component: WordContanerComponent;
  let fixture: ComponentFixture<WordContanerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordContanerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordContanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
