import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleColumnLayoutComponent } from './single-column-layout.component';

describe('SingleColumnLayoutComponent', () => {
  let component: SingleColumnLayoutComponent;
  let fixture: ComponentFixture<SingleColumnLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleColumnLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleColumnLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
