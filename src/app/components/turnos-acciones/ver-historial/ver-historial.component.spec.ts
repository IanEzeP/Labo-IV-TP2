import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHistorialComponent } from './ver-historial.component';

describe('VerHistorialComponent', () => {
  let component: VerHistorialComponent;
  let fixture: ComponentFixture<VerHistorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerHistorialComponent]
    });
    fixture = TestBed.createComponent(VerHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
