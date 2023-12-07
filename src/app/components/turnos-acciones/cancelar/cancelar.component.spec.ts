import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarComponent } from './cancelar.component';

describe('CancelarComponent', () => {
  let component: CancelarComponent;
  let fixture: ComponentFixture<CancelarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelarComponent]
    });
    fixture = TestBed.createComponent(CancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
