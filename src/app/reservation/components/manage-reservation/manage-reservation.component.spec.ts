import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReservationComponent } from './availability.component';

describe('AvailabilityComponent', () => {
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
