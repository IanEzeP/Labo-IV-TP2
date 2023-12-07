import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorarComponent } from './valorar.component';

describe('ValorarComponent', () => {
  let component: ValorarComponent;
  let fixture: ComponentFixture<ValorarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValorarComponent]
    });
    fixture = TestBed.createComponent(ValorarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
