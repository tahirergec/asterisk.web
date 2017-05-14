import {Component, Input} from "@angular/core";

@Component({
  selector: "widget",
  template: `
    <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
      <div class="tile-stats">
        <div class="icon"><i class="fa fa-{{icon}}"></i></div>
        <div class="count">{{decimal}}</div>
        <h3>{{caption}}</h3>
        <p>{{description}}</p>
      </div>
    </div>
  `
})
export class WidgetComponent {

  @Input()
  private decimal: number;

  @Input()
  private caption: string;

  @Input()
  private description: string;

  @Input()
  private icon: string;

}
