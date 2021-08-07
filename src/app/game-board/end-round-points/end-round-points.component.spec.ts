/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EndRoundPointsComponent } from './end-round-points.component';

describe('EndRoundPointsComponent', () => {
  let component: EndRoundPointsComponent;
  let fixture: ComponentFixture<EndRoundPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndRoundPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndRoundPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
