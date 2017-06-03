import {Component, EventEmitter, Input, Output} from "@angular/core";
import {bootstrap} from "@angular/upgrade/src/angular_js";

@Component({
  "selector": "material-window",
  "template": `
    <div *ngIf="opened" class="x_panel x_window {{cssClass}}">
      <div class="x_title">
        <h2>{{title}}</h2>
        <ul class="nav navbar-right panel_toolbox">
          <li><a href="javascript:void(0)" (click)="close()" class="close-link">
            <i class="fa fa-close"></i></a>
          </li>
        </ul>
        <div class="clearfix"></div>
      </div>
      <div class="x_content">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class WindowModule {

  private _opened: boolean = false;

  @Input() public title: string = "Заголовок окна";
  @Input() public cssClass: string = "";
  @Input() public set opened(value: boolean) {
    this._opened = value;
    this.changeState.emit(this._opened);
  }

  public get opened(): boolean {
    return this._opened;
  }

  @Output() public changeState: EventEmitter<boolean> = new EventEmitter<boolean>();

  close() {
    this.opened = false;
  }

}
