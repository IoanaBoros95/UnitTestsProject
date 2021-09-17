import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';


const mockDataLogin = ['ioana.boros', '123456'];

describe('AuthService', () => {
  const responseForm = '<app-user-login-form />';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
  });

  it('should be called with proper arguments', () => {
    const authService = TestBed.get(AuthService);
    const http = TestBed.get(HttpTestingController);
    let loginResponse;

    authService.login(mockDataLogin).subscribe((response: any) => {
      loginResponse = response;
    });

    http.expectOne({
      url: 'http://localhost:4200/login-form',
      method: 'POST'
    }).flush(responseForm);
  });

  it('should be called with proper arguments and headers plus body', () => {
    const authService = TestBed.get(AuthService);
    const http = TestBed.get(HttpTestingController);
    let loginResponse;

    authService.login('ioana.boros', '123456').subscribe((response: any) => {
      loginResponse = response;
    });

    http.expectOne((request: HttpRequest<any>) => {
      return request.method == 'POST'
        && request.url == 'http://localhost:4200/login-form'
        && JSON.stringify(request.body) === JSON.stringify({
          username: 'ioana.boros', password: '123456'
        })
        && request.headers.get('Content-Type') === 'application/json';
    }).flush(responseForm);
  });
});