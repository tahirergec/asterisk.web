import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "../../services/http.service";
import {LockerService} from "../../services/locker.service";
import {ScenarioService} from "./scenarios.service";
import {Router} from "@angular/router";

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
          <a class="btn btn-primary" routerLink="/scenarios/list"><i class="fa fa-arrow-left"></i> Отменить</a>
          <button class="btn btn-primary" type="reset"><i class="fa fa-refresh"></i> Сбросить</button>
          <button [disabled]="!form.valid" type="submit" class="btn btn-success"><i class="fa fa-save"></i> Сохранить</button>
        </div>
      </div>
    </form>
  `
})
export class ScenarioCreateComponent implements OnInit{

  private form: FormGroup;
  private queues: Array<any> = [];
  private scenarios: Array<any> = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private locker: LockerService,
              private scenario: ScenarioService, private router: Router) { }

  private loadData() {
    this.http.post('Asterisk.queue_list', {'offset': 0, 'limit': 999})
      .subscribe((data) => this.queues = data.rows);
    this.http.post('Scenario.tree')
      .subscribe((data) => this.scenarios = data);
  }

  ngOnInit() {
    this.locker.lock();
    setTimeout(() => this.locker.unlock(), 1000);

    this.loadData();

    this.form = this.fb.group({
      "scenario_caption": ["", Validators.required],
      "scenario_text": [""],
      "autorun": [""],
      "parent_id": [""],
    })
}

  onSubmit() {
    const post_data = {
      "caption": this.form.value['scenario_caption'],
      "scenario_data": {
        "text": this.form.value['scenario_text'],
        "parent_id": '' === this.form.value['parent_id'] ? null : this.form.value['parent_id'],
        "for_queue": this.form.value['autorun'],
      }
    };

    this.http.post('Scenario.create', post_data)
      .subscribe((response) => {
        this.scenario.reload_tree();
        this.router.navigate(['scenarios', 'edit', response.id]);
      });
  }

}
