import {Component, TemplateRef, ViewChild} from "@angular/core";
import {UsersMaterialTableComponent} from "../modules/@Datatable-exten/datatable-users.component";
import {HttpClient} from "../services/http.service";

@Component({
  template: `
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_title">
            <h2>Список пользователей</h2>
            <a class="btn btn-primary pull-right" routerLink="/users/create">
              <i class="fa fa-plus"></i> Создать
            </a>
            <a class="btn btn-primary pull-right" (click)="reloadList()">
              <i class="fa fa-refresh"></i> Обновить
            </a>
            <div class="clearfix"></div>
          </div>
          <div class="x_content">
            <users-material-table
              [api_action]="'Asterisk.user_list'"
              [columns]="columns">
            </users-material-table>
            <template #userFio let-row="row">
              <span *ngIf="row.fio">{{row.fio}}</span>
              <span *ngIf="!row.fio"><i>Неизвестно</i></span>
            </template>
            <template #userStatus let-row="row">
              <span *ngIf="row.is_online"><i class="usr-status online"></i> Зарегистрирован</span>
              <span *ngIf="!row.is_online"><i class="usr-status"></i> Не зарегистрирован</span>
            </template>
            <template #userBtns let-row="row">
              <a [routerLink]="['/users', row.id]" class="btn btn-default"><i class="fa fa-pencil-square"></i></a>
              <a (click)="removePhone(row.id)" class="btn btn-default"><i class="fa fa-trash"></i></a>
            </template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UsersListComponent {

  private columns;

  @ViewChild('userFio')
  private userFio: TemplateRef<any>;

  @ViewChild('userStatus')
  private userStatus: TemplateRef<any>;

  @ViewChild('userBtns')
  private userBtns: TemplateRef<any>;

  @ViewChild(UsersMaterialTableComponent)
  private userList: UsersMaterialTableComponent;

  constructor(private http: HttpClient) { }

  reloadList() {
    this.userList.loadList();
  }

  ngOnInit() {
    this.columns = [
      {"caption": "Номер", "name": "name"},
      {"caption": "Имя пользователя", "name": "fio", "template": this.userFio},
      {"caption": "Статус пользователя", "name": "status", "template": this.userStatus},
      {"caption": "", "name": "name", "template": this.userBtns},
    ];
  }

  removePhone(user_id) {
    if(!confirm("Все данные об этом номере будут удалены безвозвратно, продолжить?")) {
      return;
    }

    this.http.post("Asterisk.user_remove", {"user_id": parseInt(user_id)})
      .subscribe((response) => this.reloadList())

  }

}
