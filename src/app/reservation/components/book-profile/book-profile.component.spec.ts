import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookProfileComponent } from './business-profile.component';

describe('ReservationNewComponent', () => {
  let component: BookProfileComponent;
  let fixture: ComponentFixture<BookProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
