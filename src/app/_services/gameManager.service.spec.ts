/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GameManagerService } from './gameManager.service';

describe('Service: GameManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameManagerService]
    });
  });

  it('should ...', inject([GameManagerService], (service: GameManagerService) => {
    expect(service).toBeTruthy();
  }));
});
