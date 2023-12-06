import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionAccesoComponent } from './verificacion-acceso.component';

describe('VerificacionAccesoComponent', () => {
  let component: VerificacionAccesoComponent;
  let fixture: ComponentFixture<VerificacionAccesoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificacionAccesoComponent]
    });
    fixture = TestBed.createComponent(VerificacionAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
