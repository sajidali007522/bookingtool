import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseKeepingComponent } from './house-keeping.component';

describe('HouseKeepingComponent', () => {
  let component: HouseKeepingComponent;
  let fixture: ComponentFixture<HouseKeepingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseKeepingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseKeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
