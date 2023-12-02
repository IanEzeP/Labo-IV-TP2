import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessUsersComponent } from './access-users.component';

describe('AccessUsersComponent', () => {
  let component: AccessUsersComponent;
  let fixture: ComponentFixture<AccessUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessUsersComponent]
    });
    fixture = TestBed.createComponent(AccessUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
