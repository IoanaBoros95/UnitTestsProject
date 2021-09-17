import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../services/user.service';

import { UsersComponent } from './users.component';
import { User } from '../model/user';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  const usersMock: User[] = [
    { id: 1, name: 'Ioana Popescu' },
    { id: 2, name: 'Maria Pop' },
    { id: 3, name: 'Marius Turcu' }
  ];

  beforeEach(async () => {
    const userServiceStub = () => ({
      getUsers: () => ({ subscribe: (f: (arg0: {}) => any) => f({usersMock}) }),
      addUser: () => ({ subscribe: (f: (arg0: {}) => any) => f({}) }),
      deleteUser: () => ({}),
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UsersComponent],
      providers: [
        { provide: UserService, useFactory: userServiceStub },
      ],
    });
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Use Cases', () => {
    beforeEach(() => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'getUsers').and.returnValue(
        of([
          {
            id: 1,
            name: 'Alan',
          },
          {
            id: 2,
            name: 'Brito',
          },
        ])
      );
      fixture.detectChanges();
    });

    it('Starts with the list of users returned by getUsers, with link ref, id, and name', () => {
      const links: Array<HTMLAnchorElement> = fixture.debugElement
        .queryAll(By.css('a'))
        .map((a) => a.nativeElement);

      expect(links.length).toBe(2);

      expect(links[0].textContent).toContain('1 Alan');
      expect(links[0].getAttribute('href')).toBe('/detail/1');

      expect(links[1].textContent).toContain('2 Brito');
      expect(links[1].getAttribute('href')).toBe('/detail/2');
    });

    it('Clicking the delete button removes the user from the list and calls deleteUser', () => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'deleteUser').and.returnValue(of());

      const delButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('button.delete')
      ).nativeElement;
      delButton.click();
      fixture.detectChanges();

      const links: Array<HTMLAnchorElement> = fixture.debugElement
        .queryAll(By.css('a'))
        .map((a) => a.nativeElement);

      expect(links.length).toBe(1);
      expect(links[0].textContent).toContain('2 Brito');
      expect(links[0].getAttribute('href')).toBe('/detail/2');

      expect(userServiceStub.deleteUser).toHaveBeenCalled();
    });

    it("Clicking the add button on a an empty textbox doesn't add to the list", () => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'addUser');

      const addButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('div > button')
      ).nativeElement;
      addButton.click();
      fixture.detectChanges();

      expect(userServiceStub.addUser).not.toHaveBeenCalled();
    });

    it("Clicking the add button on textbox with blank spaces doesn't add to the list", () => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'addUser');

      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;

      input.value = '   ';
      input.dispatchEvent(new Event('input'));

      const addButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('div > button')
      ).nativeElement;
      addButton.click();
      fixture.detectChanges();

      expect(userServiceStub.addUser).not.toHaveBeenCalled();
    });

    it('Clicking the add button adds the user to the list and clears the textbox', () => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'addUser').and.returnValue(
        of({
          id: 3,
          name: 'Cesar',
        })
      );

      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;

      input.value = 'Cesar';
      input.dispatchEvent(new Event('input'));

      const addButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('div > button')
      ).nativeElement;
      addButton.click();
      fixture.detectChanges();

      const links: Array<HTMLAnchorElement> = fixture.debugElement
        .queryAll(By.css('a'))
        .map((a) => a.nativeElement);

      expect(links.length).toBe(3);
      expect(links[2].textContent).toContain('3 Cesar');
      expect(links[2].getAttribute('href')).toBe('/detail/3');
    });
  });
});
