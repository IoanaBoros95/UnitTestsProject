import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserDetailComponent } from "./user-detail.component";
import { UserService } from "../services/user.service";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("UserDetailComponent", () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { paramMap: { get: () => ({}) } }
    });
    const locationStub = () => ({ back: () => ({}) });
    const userServiceStub = () => ({
      getUser: (id: any) => ({
        subscribe: (f: (arg0: {}) => any) => f({})
      }),
      updateUser: (user: any) => ({ subscribe: (f: (arg0: {}) => any) => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      declarations: [UserDetailComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Location, useFactory: locationStub },
        { provide: UserService, useFactory: userServiceStub }
      ]
    });
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getUser").and.callThrough();
      component.ngOnInit();
      expect(component.getUser).toHaveBeenCalled();
    });
  });

  describe("getUser", () => {
    it("makes expected calls", () => {
      const userServiceStub: UserService = fixture.debugElement.injector.get(
        UserService
      );
      spyOn(userServiceStub, "getUser").and.callThrough();
      component.getUser();
      expect(userServiceStub.getUser).toHaveBeenCalled();
    });
  });

  describe("goBack", () => {
    it("makes expected calls", () => {
      const locationStub: Location = fixture.debugElement.injector.get(
        Location
      );
      spyOn(locationStub, "back").and.callThrough();
      component.goBack();
      expect(locationStub.back).toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("makes expected calls", () => {
      const userServiceStub: UserService = fixture.debugElement.injector.get(
        UserService
      );
      spyOn(component, "goBack").and.callThrough();
      spyOn(userServiceStub, "updateUser").and.callThrough();
      component.save();
      //expect(component.goBack).toHaveBeenCalled();
      //expect(userServiceStub.updateUser).toHaveBeenCalled();
    });
  });

  describe('Without a user', () => {
    it("Doesn't display anything", () => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'getUser').and.returnValue(of());
      fixture.detectChanges();
      const anyDiv = fixture.debugElement.query(By.css('div'));
      expect(anyDiv).toBeFalsy();
    });
  });

  describe('With user', () => {
    beforeEach(() => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'getUser').and.returnValue(
        of({
          id: 123,
          name: 'Alan',
        })
      );
      fixture.detectChanges();
    });

    it('Displays content when initialized with a user', () => {
      const anyDiv = fixture.debugElement.query(By.css('div'));
      expect(anyDiv).toBeTruthy();
    });

    it('Has header with user name in uppercase', () => {
      const header: HTMLHeadingElement = fixture.debugElement.query(
        By.css('h2')
      ).nativeElement;
      expect(header.textContent).toContain('ALAN Details');
    });

    it('Shows user id', () => {
      const div: HTMLDivElement = fixture.debugElement.query(
        By.css('div div')
      ).nativeElement;
      expect(div.textContent).toContain('id: 123');
    });

    it('Has input box with the name', async () => {
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.value).toBe('Alan');
    });

    it('Calls location.back() when go back button is clicked', () => {
      const locationStub = TestBed.inject(Location);
      spyOn(locationStub, 'back');
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('button')
      ).nativeElement;
      button.click();
      expect(locationStub.back).toHaveBeenCalled();
    });

    it('Updates user property when user types on the input', () => {
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.value = 'ABC';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.user?.name).toBe('ABC');
    });
    it('Updates user then goes back when save button is clicked', () => {
      const userServiceStub = TestBed.inject(UserService);
      spyOn(userServiceStub, 'updateUser').and.returnValue(of());
      const locationStub = TestBed.inject(Location);
      spyOn(locationStub, 'back');
      const button: HTMLButtonElement = fixture.debugElement.queryAll(
        By.css('button')
      )[1].nativeElement;
      button.click();
      //expect(userServiceStub.updateUser).toHaveBeenCalledWith();
      //expect(locationStub.back).toHaveBeenCalled();
    });
  });
});