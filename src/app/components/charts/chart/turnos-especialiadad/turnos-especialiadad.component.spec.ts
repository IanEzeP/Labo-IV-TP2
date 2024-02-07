import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosEspecialiadadComponent } from './turnos-especialiadad.component';

describe('TurnosEspecialiadadComponent', () => {
  let component: TurnosEspecialiadadComponent;
  let fixture: ComponentFixture<TurnosEspecialiadadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosEspecialiadadComponent]
    });
    fixture = TestBed.createComponent(TurnosEspecialiadadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
