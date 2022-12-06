import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureCaptureComponent } from './signature-capture.component';

describe('SignatureCaptureComponent', () => {
  let component: SignatureCaptureComponent;
  let fixture: ComponentFixture<SignatureCaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureCaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
