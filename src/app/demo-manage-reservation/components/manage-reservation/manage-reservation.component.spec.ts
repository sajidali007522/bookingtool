import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReservationComponent } from './housekeeping.component';

describe('HousekeepingComponent', () => {
  let component: ManageReservationComponent;
  let fixture: ComponentFixture<ManageReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
