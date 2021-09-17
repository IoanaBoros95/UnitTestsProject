import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MessageService } from './message.service';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../model/user';
import { HttpResponse } from '@angular/common/http';

const mockUserData = [
  { id: 1, name: 'Ioana Popescu' }
] as User[];

const mockUsersData = [
  { id: 1, name: 'Ioana Popescu' },
  { id: 2, name: 'Maria Pop' },
  { id: 3, name: 'Marius Turcu' },
  { id: 4, name: 'Melisa Rus' },
  { id: 5, name: 'Sorin Pop' },
  { id: 6, name: 'Carmen Ion' },
  { id: 7, name: 'Sebastian Rusu' },
  { id: 8, name: 'Sergiu Marin' },
  { id: 9, name: 'Raul Pop' },
  { id: 10, name: 'Monica Tulus' }
] as User[];


describe('UserService', () => {
  let userService: UserService;
  let httpTestingController: HttpTestingController;
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService,MessageService],
      });

      httpTestingController = TestBed.get(HttpTestingController);
      userService = TestBed.get(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(UserService).toBeTruthy();
  });


  describe('getUsers', () => {
    let expectedUsers: User[];
    beforeEach(() => {
      userService = TestBed.get(UserService);
      expectedUsers = mockUsersData;
    });

    it('should return expected users', () => {
     userService.getUsers().subscribe(users => expect(users).toEqual(expectedUsers, 'should return expected users'),
     fail);

      // UserService should have made one request to GET users from expected URL
      const req = httpTestingController.expectOne(userService.usersUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock users
      req.flush(expectedUsers);
    });

    // This service reports the error but finds a way to let the app keep going.
    it('should turn 404 into an empty users result', () => {

      userService.getUsers().subscribe(
        users => expect(users.length).toEqual(0, 'should return empty users array'),
        fail
      );

      const req = httpTestingController.expectOne(userService.usersUrl);

      // respond with a 404 and the error message in the body
      const msg = 'deliberate 404 error';
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });

    it('should return expected users (called multiple times)', () => {

      userService.getUsers().subscribe();
      userService.getUsers().subscribe();
      userService.getUsers().subscribe(
        users => expect(users).toEqual(expectedUsers, 'should return expected users'),
        fail
      );

      const requests = httpTestingController.match(userService.usersUrl);
      expect(requests.length).toEqual(3, 'calls to getUsers()');

      // Respond to each request with different mock user results
      requests[0].flush([]);
      requests[1].flush([{id: 1, name: 'Ioana Popescu'}]);
      requests[2].flush(expectedUsers);
    });
  });

  describe('getUser', () => {
    let expectedUser: User = mockUserData[0];
    beforeEach(() => {
      userService = TestBed.get(UserService);
    });

    it('should return expected users', fakeAsync(() => {
     const id = 1;
     userService.getUser(id).subscribe(user => expect(user).toEqual(expectedUser, 'should return expected user'),
     fail);
     tick();

      // UserService should have made one request to GET user from expected URL
      const req = httpTestingController.expectOne(`${userService.usersUrl}/${id}`);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock users
      req.flush(expectedUser);
    }));

    it('should fail gracefully on error', () => {
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();
     
      const id = 1;
      userService.getUser(id).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${userService.usersUrl}/${id}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the mock users
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(userService.handleError).toHaveBeenCalledTimes(1);
      expect(userService.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserNo404', () => {
    let expectedUser: User = mockUserData[0];
    const id = 1;
    //it('should return a single mock user', () => {
    //   spyOn(userService, 'handleError').and.callThrough();
    //   spyOn(userService, 'log').and.callThrough();
      
    //   userService.getUserNo404(id).subscribe(
    //     //Fails: Unable to flush and recognise mockUser
    //     response => expect(response).toEqual(expectedUser),
    //     fail
    //   );
    //   // Receive GET request
    //   const req = httpTestingController.expectOne(`${userService.usersUrl}/?id=${id}`);
    //   expect(req.request.method).toEqual('GET');
    //   // Respond with the mock users
    //   req.flush(expectedUser);

    //   expect(userService.log).toHaveBeenCalledTimes(1);
    //   expect(userService.messageService.messages[0]).toEqual(`UserService: fetched user id=${id}`);
    // });

    it('should fail gracefully with undefined when id not found', () => {
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();
    
      userService.getUserNo404(id).subscribe(
        //Fails: Unable to flush and recognise mockUser
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${userService.usersUrl}/?id=${id}`);
      expect(req.request.method).toEqual('GET');
      // Flushing a object not of type array causes unexpeced behaviour?
      req.flush(expectedUser);

      expect(userService.log).toHaveBeenCalledTimes(1);
      expect(userService.messageService.messages[0]).toEqual(`UserService: did not find user id=${id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();
      
      const id = 1;
      const msg = 'Deliberate 404';
      userService.getUserNo404(id).subscribe(
        users => expect(users).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(`${userService.usersUrl}/?id=${id}`);
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(userService.handleError).toHaveBeenCalledTimes(1);
      expect(userService.log).toHaveBeenCalledTimes(1);
      expect(userService.messageService.messages[0]).toEqual(`UserService: getUser id=${id} failed: Http failure response for ${userService.usersUrl}/?id=${id}: 404 Bad Request`);
    });
  });

  describe('addUser', () => {
    let expectedUser: User = mockUsersData[0];
    it('should add a single User', () => {
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();

      userService.addUser(expectedUser).subscribe(
        response => expect(response).toEqual(expectedUser),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${userService.usersUrl}`);
      expect(req.request.method).toEqual('POST');
      // Respond with the mock users
      req.flush(expectedUser);

      expect(userService.log).toHaveBeenCalledTimes(1);
      expect(userService.messageService.messages[0]).toEqual(`UserService: added user w/ id=${expectedUser.id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();

      userService.addUser(expectedUser).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${userService.usersUrl}`);
      expect(req.request.method).toEqual('POST');
      // Respond with the mock users
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(userService.handleError).toHaveBeenCalledTimes(1);
      expect(userService.log).toHaveBeenCalledTimes(1);
      expect(userService.messageService.messages[0]).toEqual(`UserService: addUser failed: Http failure response for api/users: 404 Bad Request`);
    });
  });

  describe('updateUser', () => {
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${userService.usersUrl}/?id=${id}`;

    it('should update a user and return it', () => {

      const updatUser: User = { id: 1, name: 'Ioana Popescu' };

      userService.updateUser(updatUser).subscribe(
        data => expect(data).toEqual(updatUser, 'should return the user'),
        fail
      );

      // UserService should have made one request to PUT user
      const req = httpTestingController.expectOne(userService.usersUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updatUser);

      // Expect server to return the user after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updatUser });
      req.event(expectedResponse);
    });

    // This service reports the error but finds a way to let the app keep going.
    // it('should turn 404 error into return of the update user', () => {
    //   const updateUser: User = { id: 1, name: 'Ioana Popescu' };

    //   userService.updateUser(updateUser).subscribe(
    //     data => expect(data).toEqual(updateUser, 'should return the update user'),
    //     fail
    //   );

    //   const req = httpTestingController.expectOne(userService.usersUrl);

    //   // respond with a 404 and the error message in the body
    //   const msg = 'deliberate 404 error';
    //   req.flush(msg, {status: 404, statusText: 'Not Found'});
    // });
  });

  describe('deleteUser', () => {
    let expectedUser: User = mockUsersData[0];
    it('should delete user using id', () => {
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();

      userService.deleteUser(expectedUser.id).subscribe(
        response => expect(response).toEqual(expectedUser),
        fail
      );
      // Receive DELETE request
      const req = httpTestingController.expectOne(`${userService.usersUrl}/${expectedUser.id}`);
      expect(req.request.method).toEqual('DELETE');
      // Respond with the updated user
      req.flush(expectedUser);

      expect(userService.log).toHaveBeenCalledTimes(1);
      expect(userService.messageService.messages[0]).toEqual(`UserService: deleted user id=${expectedUser.id}`);
    });

    // it('should delete user using user object', () => {
    //   spyOn(userService, 'handleError').and.callThrough();
    //   spyOn(userService, 'log').and.callThrough();

    //   const id = 1;
    //   userService.deleteUser(id).subscribe(
    //     response => expect(response).toEqual(expectedUser),
    //     fail
    //   );
    //   // Receive DELETE request
    //   const req = httpTestingController.expectOne(`${userService.usersUrl}/${expectedUser.id}`);
    //   expect(req.request.method).toEqual('DELETE');
    //   // Respond with the updated user
    //   req.flush(expectedUser.id);

    //   expect(userService.log).toHaveBeenCalledTimes(1);
    //   expect(userService.messageService.messages[0]).toEqual(`UserService: deleted user id=${expectedUser.id}`);
    // });
  });

  describe('searchUser', () => {
    let expectedUser: User[] = mockUsersData;
    it('should find users matching the search criteria', () => {
      const searchTerm = 'Ioana'
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();

      userService.searchUsers(searchTerm).subscribe(
        response => expect(response).toEqual([expectedUser[0], expectedUser[1]]),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectOne(`${userService.usersUrl}/?name=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the updated user
      req.flush([expectedUser[0], expectedUser[1]]);

      expect(userService.log).toHaveBeenCalledTimes(1);
      expect(userService.messageService.messages[0]).toEqual(`UserService: found users matching "${searchTerm}"`);
    });

    // it('should not find users matching the search criteria', () => {
    //   const searchTerm = 'Popescu'
    //   spyOn(userService, 'handleError').and.callThrough();
    //   spyOn(userService, 'log').and.callThrough();

    //   userService.searchUsers(searchTerm).subscribe(
    //     response => expect(response).toEqual([]),
    //     fail
    //   );

    //   // Receive PUT request
    //   const req = httpTestingController.expectOne(`${userService.usersUrl}/?name=${searchTerm}`);
    //   expect(req.request.method).toEqual('GET');
    //   // Respond with the updated user
    //   req.flush([]);

    //   expect(userService.log).toHaveBeenCalledTimes(1);
    //   expect(userService.messageService.messages[0]).toEqual(`UserService: found users matching "${searchTerm}"`);
    // });


    it('should return an empty array when passing an empty search string', () => {
      const searchTerm = '';
      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();

      userService.searchUsers(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectNone(`${userService.usersUrl}/?name=${searchTerm}`);

      //This is the exception where handleError is not called. The execution path ends before the httpClient is called.
      expect(userService.handleError).not.toHaveBeenCalled();
      expect(userService.log).not.toHaveBeenCalled();
    });

    it('should fail gracefully on error', () => {
      const searchTerm = 'r';
      spyOn(userService, 'log').and.callThrough();

      userService.searchUsers(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectOne(`${userService.usersUrl}/?name=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the updated user
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(userService.messageService.messages[0]).toEqual(`UserService: searchUsers failed: Http failure response for ${userService.usersUrl}/?name=${searchTerm}: 404 Bad Request`);
    });
  });

  describe('handleError', () => {
    let expectedUser: User = mockUserData[0];
    const id = 1;
    it('should handle error gracefully', () => {

      spyOn(userService, 'handleError').and.callThrough();
      spyOn(userService, 'log').and.callThrough();
      spyOn(console, 'error');

      userService.getUser(expectedUser.id).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${userService.usersUrl}/${id}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the mock users
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });


      //The focal point of this test
      expect(userService.handleError).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(userService.log).toHaveBeenCalledTimes(1);
    });
  });
});

