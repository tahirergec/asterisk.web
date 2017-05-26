import {Component} from "@angular/core";
import {HttpClient} from "../services/http.service";

@Component({
  template: `
    <div class="row top_tiles">
      <widget *ngFor="let widget of widgets"
        [decimal]="widget.decimal"
        [caption]="widget.caption"
        [description]="widget.description"
        [icon]="widget.icon">
      </widget>
    </div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_title">
            <h2>Список звонков</h2>
            <ul class="nav navbar-right panel_toolbox">
              <li class="pull-right">
                <a class="collapse-link" (click)="reload()"><i class="fa fa-refresh"></i></a></li>
            </ul>
            <div class="clearfix"></div>
          </div>
          <div class="x_content">
            <call-list></call-list>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {

  private widgets: Array<any> = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post('Dashboard.get_statistic')
      .subscribe((widgets) => this.widgets = widgets)
  }

  reload(): void {
    alert('111')
  }

}
