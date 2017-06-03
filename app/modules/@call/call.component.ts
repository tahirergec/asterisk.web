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
              <a href="#">{{loc_dial.calleridnum}}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <br>
    <p>Телефон клиента: <strong>{{call.calleridnum}}</strong></p>
    <p>Тип вызова: <strong>{{call.type}}</strong></p>
    <p *ngIf="call.queue">Звонок в отдел: <strong>{{call.queue}}</strong></p>
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
    let cmd = JSON.stringify({"Action": "Park", "Channel": this.call.channel1});

    this.callcentre.send_message(cmd);
    this.parked = true;
  }

  unparking() {
    let cmd = JSON.stringify({"Action": "Redirect", "Channel": this.call.channel1,
      "Exten": "101", "Context": "blank", "Priority": "1"});

    this.callcentre.send_message(cmd);
    this.parked = false;

  }

}
