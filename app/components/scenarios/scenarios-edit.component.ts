import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "../../services/http.service";
import {ActivatedRoute, Params, Route, Router} from "@angular/router";
import {LockerService} from "../../services/locker.service";
import {NotificationService} from "../../services/notification.service";
import {ScenarioService} from "./scenarios.service";

@Component({
  template: `
    <form [formGroup]="form" (submit)="onSubmit()" novalidate>
      <div class="form-group">
        <label>Заголовок сценария</label>
        <input type="text" formControlName="scenario_caption" class="form-control">
      </div>
      <div class="form-group">
        <label>Текст сценария</label>
        <text-editor formControlName="scenario_text"></text-editor>
      </div>
      <details>
       <summary>Дополнительные параметры</summary>
        <br>
        <div class="form-group row">
          <label class="control-label col-md-3 col-sm-3 col-xs-12">
            Родительский элемент
          </label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <select class="form-control col-md-7 col-xs-12" formControlName="parent_id">
              <option [value]="''">Нет</option>
              <option *ngFor="let scenario of scenarios" [value]="scenario.id">{{scenario.text}}</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="control-label col-md-3 col-sm-3 col-xs-12">
            Автозапуск сценария
          </label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <select class="form-control col-md-7 col-xs-12" formControlName="autorun">
              <option [value]="''">Нет</option>
              <option *ngFor="let queue of queues" [value]="queue.name">{{queue.caption}}</option>
            </select>
          </div>
        </div>
      </details>
      <div class="ln_solid"></div>
      <div class="form-group">
        <div class="col-md-9 col-sm-6 col-xs-12 col-md-offset-3">
          <a class="btn btn-danger" type="button" (click)="remove()"><i class="fa fa-trash"></i> Удалить</a>
          <button class="btn btn-primary" type="reset"><i class="fa fa-refresh"></i> Сбросить</button>
          <button [disabled]="!form.valid" type="submit" class="btn btn-success"><i class="fa fa-save"></i> Сохранить</button>
        </div>
      </div>
    </form>
  `
})
export class ScenarioEditComponent implements OnInit{


  private form: FormGroup;
  private queues: Array<any> = [];
  private scenarios: Array<any> = [];
  private set scenario_data(value: any) {
    this.form.setValue({
      "scenario_caption": value.caption,
      "scenario_text": value.text,
      "parent_id": null === value.parent_id ? '' : value.parent_id,
      "autorun": null === value.for_queue ? '' : value.for_queue,
    });
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute,
              private locker: LockerService, private notifier: NotificationService,
              private router: Router, private scenario: ScenarioService) {
    this.loadData();
  }

  private loadData() {
    this.http.post('Asterisk.queue_list', {'offset': 0, 'limit': 999})
      .subscribe((data) => this.queues = data.rows);
    this.http.post('Scenario.tree')
      .subscribe((data) => this.scenarios = data);
  }

  ngOnInit() {
    this.locker.lock();
    setTimeout(() => this.locker.unlock(), 1000);

    this.route.params
      .switchMap((params: Params) => this.http.post('Scenario.get_data', {'scenario_id': +params['id']}))
      .subscribe((data) => this.scenario_data = data);

    this.form = this.fb.group({
      "scenario_caption": ["", Validators.required],
      "scenario_text": [""],
      "parent_id": [""],
      "autorun": [""],
    })
  }

  onSubmit() {
    const post_data = {
      "caption": this.form.value['scenario_caption'],
      "text": this.form.value['scenario_text'],
      "parent_id": '' === this.form.value['parent_id'] ? null : this.form.value['parent_id'],
      "for_queue": this.form.value['autorun'],
    };

    let subscription = this.route.params
      .switchMap((params: Params) => this.http.post('Scenario.edit', {'scenario_id': +params['id'],
                                                                      'scenario_data': post_data}))
      .subscribe((data) => {
        this.notifier.notifyInfo('Усешно сохранено', 'Выполнено');
        subscription.unsubscribe();
      });
  }

  remove() {
    if(!confirm("Удалить этот сценарий и все вложенные в него?")) {
      return;
    }

    let subscription = this.route.params
      .switchMap((params: Params) => this.http.post('Scenario.remove', {'scenario_id': +params['id']}))
      .subscribe((data) => {
        this.router.navigate(['scenarios', 'list']);
        this.scenario.reload_tree();
        subscription.unsubscribe();
      });
  }

}
