import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageService } from '../services/message.service';

import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  beforeEach(() => {
    const messageServiceStub = () => ({
      clear: () => ({}),
      messages: [],
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MessagesComponent],
      providers: [{ provide: MessageService, useFactory: messageServiceStub }],
    });
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it("Doesn't display anything if messages is empty", () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    expect(div).toBeFalsy();
  });

  it('Clicking the clear button calls clear on the message service', () => {
    const messagesService = TestBed.inject(MessageService);
    messagesService.messages = [''];
    spyOn(messagesService, 'clear');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    button.click();

    expect(messagesService.clear).toHaveBeenCalled();
  });

  it('Displays each message in messages', () => {
    const messagesService = TestBed.inject(MessageService);
    messagesService.messages = ['Alan', 'Brito'];
    fixture.detectChanges();
    const divs: Array<HTMLDivElement> = fixture.debugElement
      .queryAll(By.css('div div div'))
      .map((e) => e.nativeElement);
    expect(divs.length).toBe(2);
    expect(divs[0].textContent).toContain('Alan');
    expect(divs[1].textContent).toContain('Brito');
  });
});