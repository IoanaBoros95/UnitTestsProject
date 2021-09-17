  
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    const userServiceStub = { getUsers: () => ({ subscribe: () => ({}) }) };
    TestBed.configureTestingModule({
        imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DashboardComponent],
      providers: [{ provide: UserService, useValue: userServiceStub }],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });


  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Users" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Top Users');
  });

  it('users defaults to: []', () => {
    expect(component.users).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getUsers').and.callThrough();
      component.ngOnInit();
      expect(component.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('makes expected calls', () => {
      const userServiceStub: UserService = TestBed.inject(UserService);
      spyOn(userServiceStub, 'getUsers').and.callThrough();
      component.getUsers();
      expect(userServiceStub.getUsers).toHaveBeenCalled();
    });
  });

  it('renders the links with the right hrefs and names', () => {
    const userServiceStub = TestBed.inject(UserService);
    const initialUsers = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
      { id: 5, name: 'E' },
      { id: 6, name: 'F' },
    ];
    spyOn(userServiceStub, 'getUsers').and.returnValue(of(initialUsers));

    fixture.detectChanges();

    const links = fixture.debugElement
      .queryAll(By.css('a'))
      .map<HTMLAnchorElement>((element) => element.nativeElement);
    expect(links.length).toBe(4);

    const expectedUsers = [
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
      { id: 5, name: 'E' },
    ];

    const expectedUsersAreRendered = expectedUsers.every((user) =>
      links.some(
        (link?) =>
          link.attributes.getNamedItem('href')?.value === `/detail/${user.id}` &&
          link.innerHTML.includes(user.name)
      )
    );
    expect(expectedUsersAreRendered).toBe(true);
  });
});