import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosPacientesComponent } from './turnos-pacientes.component';

describe('TurnosPacientesComponent', () => {
  let component: TurnosPacientesComponent;
  let fixture: ComponentFixture<TurnosPacientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosPacientesComponent]
    });
    fixture = TestBed.createComponent(TurnosPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
