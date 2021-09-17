import { User } from '../model/user';
import { MyUser } from './my-user.service';

const myUserNameMock = 'Ioana';
const myUserIdMock = 1;

describe('MyUser', () => {
  let subject: MyUser;

  beforeEach(() => {
    subject = new MyUser();
  });

  it('should be created', () => {
    expect(subject).toBeTruthy();
  });

  it('should return it\'s horsepower', () => {
    expect(subject.getMyUser()).toEqual(myUserNameMock);
  });

  it('should return it\'s horsepower', () => {
    expect(subject.getId()).toEqual(myUserIdMock);
  });
});