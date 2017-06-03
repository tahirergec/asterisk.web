import {Component} from "@angular/core";
import {CallcentreService} from "../services/callcentre.service";

@Component({
  selector: "app-callcentre",
  template: `
    <material-window *ngFor="let call of calls_list"
      draggable-window="true"
      [opened]="true"
      [title]="'Заголовок окна'"
      [cssClass]="'width-350'">
      <call-component
        [call]="call">
      </call-component>
    </material-window>
  `
})
export class CallcentreComponent {

  private calls_list: Array<any>;

  constructor(private callservice: CallcentreService) {
    this.calls_list = this.callservice.calls;
    this.callservice.calls_emmiter.subscribe((calls_list) => this.calls_list = calls_list);
  }

}
