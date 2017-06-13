import {EventEmitter, Injectable} from "@angular/core";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";
import {Observable, Subscription} from "rxjs/Rx";
import {AuthenticateService} from "./authenticate.service";
import {ConfigService} from "./configuration.service";
import {HttpClient} from "./http.service";

@Injectable()
export class CallcentreService {

  private my_phone: string = null;

  public calls: Array<any> = [];
  private _state: number = 0;

  private get state(): number {
    return this._state;
  }

  private set state(value: number) {
    this._state = value;
    this.state_emitter.emit(value);
  }

  public scenario_emitter: EventEmitter<any> = new EventEmitter<any>();

  private set scenario(value: any) {
    this.scenario_emitter.emit(value);
  }

  private _url: string = "";
  private _url_pattern: string = "?phone=";

  private get url(): string {
    return this._url + this._url_pattern + this.my_phone;
  }

  public calls_emmiter: EventEmitter<any> = new EventEmitter<any>();
  public state_emitter: EventEmitter<number> = new EventEmitter<number>();

  private ws: WebSocketSubject<Object>;
  private socket: Subscription;

  constructor(private auth: AuthenticateService, private conf: ConfigService, private http: HttpClient) {
    this._url = this.conf.data.ws_url;
    this.my_phone = this.auth.user.phone;
    this.connect();

    this.conf.settings_emitter.subscribe((data) => {
      this._url = data.ws_url;
      this.connect();
    });

    this.auth.user_emitter.subscribe((user) => {
      this.my_phone = user.phone;
      this.connect();
    });
  }

  private reconnect() {
    this.socket.unsubscribe();
    this.ws.complete();
    setTimeout(() => this.connect(), 1500);
  }

  private connect() {
    if(!this.my_phone || !this._url) {
      return;
    }

    this.state = -1;
    this.ws = Observable.webSocket(this.url);
    this.socket = this.ws.subscribe({
      next: (data: any) => this.deploy_data(data),
      error: () => {
        this.state = 0;
        this.reconnect();
      }
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
      case "status": {
        if(data.status == "ok") {
          this.state = 1;
        }
        break;
      }
      case "dial_begin": {
        let call = this.calls.filter(call => data.linkedid == call.linkedid);

        if(!call.length && (data.from_phone == this.my_phone || data.to_phone == this.my_phone)){
          if(data.from_phone == this.my_phone) {
            data.type = "outgoing"
          }

          if(data.to_phone == this.my_phone) {
            data.type = "incoming"
          }

          if(data.to_phone == data.from_phone) {
            data.type = "originate"
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

            if(this.calls[i].queue) {
              this.http.post('Scenario.get_by_queue', {'queue_name': this.calls[i].queue})
                .subscribe((data) => this.scenario = data);
            }
          }

          if("originate" != this.calls[i].type &&
              data.bridgeuniqueid == this.calls[i].bridge_id &&
              data.channel != this.calls[i].channel1 &&
              data.channel != this.calls[i].channel2) {
            this.calls[i].last_channel = data.channel;
          }

          if("originate" == this.calls[i].type &&
              data.linkedid == this.calls[i].linkedid &&
              data.channel.indexOf("/"+this.my_phone) == -1) {
            this.calls[i].last_channel = data.channel;
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
            this.calls[i].queue = data.queue;
          }
        }
        break;
      }
    }
  }

  public parking(channel: string) {
    const cmd = JSON.stringify({"Action": "Park", "Channel": channel});
    this.send_message(cmd);
  }

  public unparking(channel: string) {
    const cmd = JSON.stringify({"Action": "Redirect", "Channel": channel, "Exten": this.my_phone, "Context": "blank",
      "Priority": "1"});
    this.send_message(cmd);
  }

  public make_call(number: string) {
    const cmd = JSON.stringify({
      "Action": "Originate",
      "Channel": "LOCAL/" + this.my_phone + "@blank",
      "Context": "local_calls",
      "Priority": "1",
      "Exten": number,
      "Async": "1",
    });

    this.send_message(cmd);
  }

  public send_message(message: string) {
    this.ws.next(message);
  }

}
