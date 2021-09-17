import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
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
    ];
    return {users};
  }

  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 11;
  }
}