import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

const mockMessageData = ['Message is available'];

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('messages defaults to: []', () => {
    expect(service.messages).toEqual([]);
  });

  it('adds a message', () => {
    service.add('Message is available');
    expect(service.messages).toEqual(mockMessageData);
  });

  it('clears all messages', () => {
    service.add('Message is available');
    service.clear();
    expect(service.messages).toEqual([]);
  });
});
