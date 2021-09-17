import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { UserLoginFormComponent } from './user-login-form.component';

describe('UserLoginFormComponent', () => {
  let component: UserLoginFormComponent;
  let fixture: ComponentFixture<UserLoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLoginFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('username', () => {
    it('should be valid with between 4 and 10 characters (inclusive)', async(() => {
      component.username.setValue('aaaaaaaaaa');

      expect(component.username.valid).toBeTruthy();
    }));

    it('should be required', async(() => {
      expect(component.username.errors!['required']).toBeDefined();

      component.username.setValue('a');

      expect(component.username.errors!['required']).toBeUndefined();
    }));

    it('should have an error with fewer than 4 characters', async(() => {
      component.username.setValue('aaa');
      expect(component.username.errors?.minlength).toBeDefined();
    }));

    it('should have an error with more than 10 characters', async(() => {
      component.username.setValue('aaaaaaaaaaa');
      expect(component.username.errors?.maxlength).toBeDefined();
    }));
  });

  describe('password', () => {
    it('should be valid with more than 6 characters', async(() => {
      component.password.setValue('aaaaaaaaaa');

      expect(component.password.valid).toBeTruthy();
    }));

    it('should be required', async(() => {
      expect(component.password.errors!['required']).toBeDefined();

      component.password.setValue('a');

      expect(component.password.errors!['required']).toBeUndefined();
    }));
  });

  describe('submit', () => {
    it('should call onSubmit()', fakeAsync(() => {
      fixture.detectChanges();
      component.onSubmit();
      expect(component.onSubmit).toBeTruthy();
    }));
  });
});
