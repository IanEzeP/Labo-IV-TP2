import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerValoracionComponent } from './ver-valoracion.component';

describe('VerValoracionComponent', () => {
  let component: VerValoracionComponent;
  let fixture: ComponentFixture<VerValoracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerValoracionComponent]
    });
    fixture = TestBed.createComponent(VerValoracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
