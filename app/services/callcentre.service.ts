import {EventEmitter, Injectable} from "@angular/core";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";
import {Observable, Subscription} from "rxjs/Rx";

@Injectable()
export class CallcentreService {

  private my_phone: string = "102";

  public calls: Array<any> = [];
  public calls_emmiter: EventEmitter<any> = new EventEmitter<any>();

  private ws: WebSocketSubject<Object>;
  private socket: Subscription;
  private url: string = "ws://localhost:8800/ws?phone=" + this.my_phone;

  constructor() {
    this.ws = Observable.webSocket(this.url);
    this.socket = this.ws.subscribe({
      next: (data: any) => this.deploy_data(data),

    });
  }

  private deploy_data(data) {

    if(data.action_type == "dial_begin" &&
      data.action_type == "agent_connect" &&
      data.from_phone != this.my_phone &&
      data.to_phone != this.my_phone) {
      return;
    }

    switch(data.action_type) {
      case "dial_begin": {
        let call = this.calls.filter(call => data.linkedid == call.linkedid);

        if(!call.length){
          if(data.from_phone == this.my_phone) {
            data.type = "outgoing"
          }

          if(data.to_phone == this.my_phone) {
            data.type = "incoming"
          }

          this.calls.push(data);
          this.calls_emmiter.emit(this.calls);
        }

        break;
      }
      case "bridge_enter": {
        for(let i=0; i < this.calls.length; i++) {
          if (data.channel == this.calls[i].channel1 || data.channel == this.calls[i].channel2) {
            this.calls[i].active_call = true;
            this.calls[i].bridge_id = data.bridgeuniqueid;
          }
        }
        break;
      }
      case "bridge_leave": {
        for(let i=0; i < this.calls.length; i++) {
          if (data.bridgeuniqueid == this.calls[i].bridge_id) {
            this.calls[i].active_call = false;
          }
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
    }
  }

  public send_message(message: string) {
    this.ws.next(message);
  }

}
