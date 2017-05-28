import {Component} from "@angular/core";
import {HttpClient} from "../services/http.service";
import {ConfigService} from "../services/configuration.service";

@Component({
  template: `
    <div class="row top_tiles" *ngIf="display_statistic">
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
            <div class="clearfix"></div>
          </div>
          <div class="x_content">
            <call-list
              [sound_url]="config.data.sounds_url">
            </call-list>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {

  private display_statistic: boolean = true;

  private widgets: Array<any> = [];

  constructor(private http: HttpClient, private config: ConfigService) {
    this.display_statistic = this.config.data.dashboard_statistic;
    this.config.settings_emitter.subscribe((data) => this.display_statistic = data.dashboard_statistic);
  }

  ngOnInit() {
    this.http.post('Dashboard.get_statistic')
      .subscribe((widgets) => this.widgets = widgets)
  }

}
