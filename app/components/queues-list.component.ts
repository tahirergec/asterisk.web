import {Component, TemplateRef, ViewChild} from "@angular/core";
import {MaterialTableComponent} from "../modules/@Datatable/components/datatable.component";
import {HttpClient} from "../services/http.service";

@Component({
  template: `
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_title">
            <h2>Список отделов</h2>
            <a class="btn btn-primary pull-right" routerLink="/queues/create">
              <i class="fa fa-plus"></i> Создать
            </a>
            <a class="btn btn-primary pull-right" (click)="reloadList()">
              <i class="fa fa-refresh"></i> Обновить
            </a>
            <div class="clearfix"></div>
          </div>
          <div class="x_content">
            <material-table
              [api_action]="'Asterisk.queue_list'"
              [columns]="columns">
            </material-table>
            <template #queueBtns let-row="row">
              <a [routerLink]="['/queues', row.name]" class="btn btn-default">
                <i class="fa fa-pencil-square"></i></a>
              <a (click)="removeQueue(row.name)" class="btn btn-default"><i class="fa fa-trash"></i></a>
            </template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QueuesListComponent {

  private columns;

  @ViewChild('queueBtns')
  private queueBtns: TemplateRef<any>;

  @ViewChild(MaterialTableComponent)
  private queueList: MaterialTableComponent;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.columns = [
      {"name": "caption", "caption": "Название отдела"},
      {"name": "members", "caption": "Кол-во сотрудников"},
      {"name": "strategy", "caption": "Стратегия вызова"},
      {"name": "name", "caption": "", "template": this.queueBtns}
    ]
  }

  reloadList() {
    this.queueList.loadList();
  }

  removeQueue(name) {
    if(!confirm("Все данные об этом отделе будут удалены безвозвратно, продолжить?")) {
      return;
    }

    this.http.post("Asterisk.queue_remove", {"name": name})
      .subscribe((response) => this.reloadList())
  }

}
