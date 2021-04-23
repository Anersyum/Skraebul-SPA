/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Guess_wordService } from './guess_word.service';

describe('Service: Guess_word', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Guess_wordService]
    });
  });

  it('should ...', inject([Guess_wordService], (service: Guess_wordService) => {
    expect(service).toBeTruthy();
  }));
});
