import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionIlsPage } from './session-ils.page';

describe('SessionIlsPage', () => {
  let component: SessionIlsPage;
  let fixture: ComponentFixture<SessionIlsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionIlsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionIlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
