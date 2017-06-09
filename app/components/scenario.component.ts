import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  template: `
    <div class="row">
      <div class="col-lg-3 col-md-4">
        <div class="x_panel">
          <div class="x_content">
            <scenario-tree>
            </scenario-tree>
          </div>
        </div>
      </div>
      <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_content">
            <form [formGroup]="form" (submit)="onSubmit()" novalidate>
              <div class="form-group">
                <label>Заголовок сценария</label>
                <input type="text" formControlName="scenario_caption" class="form-control">
              </div>
              <div class="form-group">
                <label>Текст сценария</label>
                <text-editor formControlName="scenario_text"></text-editor>
              </div>
              {{form.value|json}}
              <div class="ln_solid"></div>
              <div class="form-group">
                <div class="col-md-9 col-sm-6 col-xs-12 col-md-offset-3">
                  <a class="btn btn-primary" type="button"><i class="fa fa-arrow-left"></i> Отменить</a>
                  <button class="btn btn-primary" type="reset"><i class="fa fa-refresh"></i> Сбросить</button>
                  <button [disabled]="!form.valid" type="submit" class="btn btn-success"><i class="fa fa-save"></i> Сохранить</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ScenarioComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      "scenario_caption": ['', Validators.required],
      "scenario_text": [''],
    })
  }

  onSubmit() {
    alert('111');
  }

}
