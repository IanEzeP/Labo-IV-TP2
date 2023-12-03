import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManejarAccesoComponent } from './manejar-acceso.component';

describe('ManejarAccesoComponent', () => {
  let component: ManejarAccesoComponent;
  let fixture: ComponentFixture<ManejarAccesoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManejarAccesoComponent]
    });
    fixture = TestBed.createComponent(ManejarAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
