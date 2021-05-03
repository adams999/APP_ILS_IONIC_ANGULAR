import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginIlsPage } from './login-ils.page';

describe('LoginIlsPage', () => {
  let component: LoginIlsPage;
  let fixture: ComponentFixture<LoginIlsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginIlsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginIlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
