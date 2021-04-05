import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordGridComponent } from './rooms.component';

describe('RoomsComponent', () => {
  let component: RecordGridComponent;
  let fixture: ComponentFixture<RecordGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
