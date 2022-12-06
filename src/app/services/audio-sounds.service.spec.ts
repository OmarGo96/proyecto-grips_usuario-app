import { TestBed } from '@angular/core/testing';

import { AudioSoundsService } from './audio-sounds.service';

describe('AudioSoundsService', () => {
  let service: AudioSoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioSoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
