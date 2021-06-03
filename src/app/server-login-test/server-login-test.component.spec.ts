import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerLoginTestComponent } from './server-login-test.component';

describe('ServerLoginTestComponent', () => {
  let component: ServerLoginTestComponent;
  let fixture: ComponentFixture<ServerLoginTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerLoginTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerLoginTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
