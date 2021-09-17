import { Injectable } from '@angular/core';

@Injectable()
export class MyUser {
  getMyUser() {
    return 'Ioana';
  }

  getId() {
    return 1;
  }
}