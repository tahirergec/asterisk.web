import {Component, TemplateRef, ViewChild} from "@angular/core";
import {PhonesMaterialTableComponent} from "../modules/@Datatable-exten/datatable-phones.component";
import {HttpClient} from "../services/http.service";

@Component({
  template: `
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_title">
            <h2>Список телефонов</h2>
            <a class="btn btn-primary pull-right" routerLink="/phones/create">
              <i class="fa fa-plus"></i> Создать
            </a>
            <a class="btn btn-primary pull-right" (click)="reloadList()">
              <i class="fa fa-refresh"></i> Обновить
            </a>
            <div class="clearfix"></div>
          </div>
          <div class="x_content">
            <phones-material-table 
              [api_action]="'Asterisk.user_list'"
              [columns]="columns">
            </phones-material-table>
            <template #phonesBtns let-row="row">
              <a [routerLink]="['/phones', row.id]" class="btn btn-default"><i class="fa fa-pencil-square"></i></a>
              <a (click)="removePhone(row.id)" class="btn btn-default"><i class="fa fa-trash"></i></a>
            </template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PhonesListComponent {

  private columns;

  @ViewChild('phonesBtns')
  private phonesBtns: TemplateRef<any>;

  @ViewChild(PhonesMaterialTableComponent)
  private phonesList: PhonesMaterialTableComponent;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.columns = [
      {"caption": "Название", "name": "fio"},
      {"caption": "Логин", "name": "name"},
      {"caption": "Сервер регистрации", "name": "host"},
      {"caption": "", "name": "name", "template": this.phonesBtns},
    ];
  }

  removePhone(user_id) {
    if(!confirm("Все данные об этом номере будут удалены безвозвратно, продолжить?")) {
      return;
    }

    this.http.post("Asterisk.phone_remove", {"user_id": parseInt(user_id)})
      .subscribe((response) => this.reloadList())

  }

  reloadList() {
    this.phonesList.loadList();
  }

}
