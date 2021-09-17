import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UserSearchComponent } from './user-search.component';
import { UserService } from '../services/user.service';
describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;
  beforeEach(() => {
    const userServiceStub = () => ({ searchUsers: (term: any) => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule],
      declarations: [UserSearchComponent],
      providers: [{ provide: UserService, useFactory: userServiceStub }],
    });
    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('Starts with an empty list', () => {
    fixture.detectChanges();
    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);
    expect(links.length).toBe(0);
  });

  it('Typing on the input box doesn’t change the list for 299ms', fakeAsync(() => {
    fixture.detectChanges(); 

   
    const userServiceStub: UserService = TestBed.inject(UserService);
    spyOn(userServiceStub, 'searchUsers').and.returnValue(
      of([{ id: 1, name: 'Alan' }])
    );

    
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;
    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    tick(299);
    fixture.detectChanges();

    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);

    expect(links.length).toBe(0);

    discardPeriodicTasks();
  }));

  it('The list of matching users appears after 300ms', fakeAsync(() => {
    fixture.detectChanges();
    const userServiceStub: UserService = TestBed.inject(UserService);

    spyOn(userServiceStub, 'searchUsers').and.returnValue(
      of([
        { id: 2, name: 'Brito' },
        { id: 3, name: 'Britton' },
      ])
    );

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;
    input.value = 'Brit';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();
    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);
    expect(links.length).toBe(2);
    expect(links[0].textContent).toContain('Brito');
    expect(links[1].textContent).toContain('Britton');
  }));

  it('Can perform multiple searches in a row - 300ms apart', fakeAsync(() => {
    fixture.detectChanges();
    const userServiceStub: UserService = TestBed.inject(UserService);

    spyOn(userServiceStub, 'searchUsers').and.callFake((term) => {
      return of(
        [
          { id: 1, name: 'Alan' },
          { id: 2, name: 'Brito' },
          { id: 3, name: 'Britton' },
        ].filter((user) => user.name.includes(term))
      );
    });

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    input.value = 'Brit';
    input.dispatchEvent(new Event('input'));
    tick(300);

   
    input.value = 'Brito';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);
    expect(links.length).toBe(1);
    expect(links[0].textContent).toContain('Brito');
    expect(links[0].getAttribute('href')).toBe('/detail/2');
  }));

  it("Doesn't perform a search if the search term doesn't change", fakeAsync(() => {
    fixture.detectChanges();
    const userServiceStub: UserService = TestBed.inject(UserService);

    spyOn(userServiceStub, 'searchUsers').and.callFake((term) => {
      return of(
        [
          { id: 1, name: 'Alan' },
          { id: 2, name: 'Brito' },
          { id: 3, name: 'Britton' },
        ].filter((user) => user.name.includes(term))
      );
    });

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    
    input.value = 'Brit';
    input.dispatchEvent(new Event('input'));
    tick(300);

    
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    expect(userServiceStub.searchUsers).toHaveBeenCalledTimes(1);
  }));
});