import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosClinicaComponent } from './turnos-clinica.component';

describe('TurnosClinicaComponent', () => {
  let component: TurnosClinicaComponent;
  let fixture: ComponentFixture<TurnosClinicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosClinicaComponent]
    });
    fixture = TestBed.createComponent(TurnosClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
