import { TestBed } from '@angular/core/testing';

import { SweetMessagesService } from './sweet-messages.service';

describe('SweetMessagesService', () => {
  let service: SweetMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
