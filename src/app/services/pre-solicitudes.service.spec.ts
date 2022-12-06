import { TestBed } from '@angular/core/testing';

import { PreSolicitudesService } from './pre-solicitudes.service';

describe('PreSolicitudesService', () => {
  let service: PreSolicitudesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreSolicitudesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
