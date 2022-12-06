import { TestBed } from '@angular/core/testing';

import { AsistenciasService } from './asistencias.service';

describe('AsistenciasService', () => {
  let service: AsistenciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
