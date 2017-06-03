import {EventEmitter, Injectable} from "@angular/core";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";
import {Observable, Subscription} from "rxjs/Rx";

@Injectable()
export class CallcentreService {

  public calls: Array<any> = [];
  public calls_emmiter: EventEmitter<any> = new EventEmitter<any>();

  private ws: WebSocketSubject<Object>;
  private socket: Subscription;
  private url: string = "ws://localhost:8888/ws?phone=101";

  constructor() {
    this.ws = Observable.webSocket(this.url);
    this.socket = this.ws.subscribe({
      next: (data: any) => {
        console.log(data);
        switch(data.action_type) {
          case "dial_begin": {
            let call = this.calls.filter(call => data.linkedid == call.linkedid);

            if(!call.length){
              this.calls.push(data);
              this.calls_emmiter.emit(this.calls);
            }

            break;
          }
          case "agent_connect": {
            for(let i=0; i < this.calls.length; i++) {
              if (data.linkedid == this.calls[i].linkedid) {
                this.calls[i] = data;
              }
            }
            break;
          }
          case "dial_end":
          case "agent_compete": {
            for(let i=0; i < this.calls.length; i++) {
              if(data.linkedid == this.calls[i].linkedid) {
                this.calls[i].active_call = false;
                this.calls_emmiter.emit(this.calls);
                break;
              }
            }
            break;
          }
        }
      }
    });
  }

  public send_message(message: string) {
    this.ws.next(message);
  }

}
