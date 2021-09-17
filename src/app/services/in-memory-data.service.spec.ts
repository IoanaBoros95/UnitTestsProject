import { TestBed } from '@angular/core/testing';

import { InMemoryDataService } from './in-memory-data.service';

const mockUsersData = [
  { id: 1, name: 'Ioana Popescu' },
];

const mockUsersData1 = [
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


describe('InMemoryDataService', () => {
  let service: InMemoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify number of users', () => {
    expect(mockUsersData1.length).toBe(10);
  });

  it('should verify number of users to equal mockdata', () => {
    expect(service.genId.length).toEqual(mockUsersData.length);
  });

  it('should verify if the number of uses is less than mock data and return true ', () => {
    expect(service.genId.length < mockUsersData1.length).toEqual(true);
  });

  it('should verify if the number of uses is greater than mock data and return false', () => {
    expect(service.genId.length > mockUsersData1.length).toEqual(false);
  });
});
