import {Component, Input} from "@angular/core";
import {CallcentreService} from "../../services/callcentre.service";

@Component({
  selector: "call-component",
  template: `
    <div class="row">
      <div class="col-sm-6">
        <a *ngIf="!parked" href="javascript:void(0)" (click)="parking()"
           class="btn btn-sm btn-primary btn-block">
          Парковка</a>
        <a *ngIf="parked" href="javascript:void(0)" (click)="unparking()"
           class="btn btn-sm btn-primary btn-block">
          Снять с парковки</a>
      </div>
      <div class="col-sm-6">
        <div class="btn-group btn-block">
          <button type="button" class="btn btn-block btn-sm btn-default dropdown-toggle"
                  toggle-dropdown="true">
            Соединить с <span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li *ngFor="let loc_dial of calls | calls_filter: call.linkedid">
              <a href="javascript:void(0)" (click)="connect(loc_dial)">{{loc_dial.calleridnum}}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <br>
    {{call|json}}
    <hr>
    <p>Статус вызова: <strong [ngClass]="{'text-success': call.active_call, 
                                          'text-muted': !call.active_call}">
                          Вызов {{call.active_call ? 'активен' : 'неактивен'}}</strong></p>
  `
})
export class DialComponent {

  @Input() private call: any;

  private parked: boolean = false;
  private calls: Array<any>;

  constructor(private callcentre: CallcentreService) {
    this.calls = this.callcentre.calls;
    this.callcentre.calls_emmiter.subscribe((calls) => this.calls = calls);
  }

  parking() {
    const channel = this.call.type == "outgoing" ? this.call.channel2 : this.call.channel1;
    this.callcentre.parking(channel);
    this.parked = true;
  }

  unparking() {
    const channel = this.call.type == "outgoing" ? this.call.channel2 : this.call.channel1;
    this.callcentre.unparking(channel);
    this.parked = false;

  }

  connect(dial) {
    let channel1, channel2;

    if((this.call.type == "outgoing" || this.call.type == "originate") && this.call.last_channel) {
      channel1 = this.call.last_channel;
    }
    else if(this.call.type == "outgoing" || this.call.type == "originate") {
      channel1 = this.call.channel2;
    }
    else {
      channel1 = this.call.channel1;
    }

    if((dial.type == "outgoing" || dial.type == "outgoing") && dial.last_channel) {
      channel2 = dial.last_channel;
    }
    else if(dial.type == "outgoing" || dial.type == "originate") {
      channel2 = dial.channel2;
    }
    else {
      channel2 = dial.channel1;
    }

    let cmd = JSON.stringify({"Action": "Bridge", "Channel1": channel1, "Channel2": channel2, "Tone": "yes",
      "Priority": "1"});

    this.callcentre.send_message(cmd);
    this.parked = false;
  }

}
