import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "../services/http.service";
import {LockerService} from "../services/locker.service";

@Component({
  template: `
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_title">
            <h2>Сообщить об ошибке</h2>
            <div class="clearfix"></div>
          </div>
          <div class="x_content">
            <form class="form-horizontal form-label-left" [formGroup]="bugForm" (submit)="onSubmit()" novalidate>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="email">
                  Ваша электронная почта <span class="required text-danger">*</span>
                </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="text" id="email" formControlName="email" class="form-control col-md-7 col-xs-12">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="text">
                  Описание ошибки <span class="required text-danger">*</span>
                </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <textarea id="text" formControlName="text" placeholder="Минимум 50 символов"
                            class="form-control col-md-7 col-xs-12" rows="7">
                  </textarea>
                </div>
              </div>
              <div class="ln_solid"></div>
              <div class="form-group">
                <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                  <button [disabled]="!bugForm.valid" type="submit" class="btn btn-danger">
                    <i class="fa fa-bug"></i> Отправить сообщение</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  `
})
export class BugReportComponent {

  bugForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private locker: LockerService) {
    this.bugForm = this.fb.group({
      "email": ['', Validators.required],
      "text": ['', Validators.required]
    })
  }

  onSubmit() {
    this.locker.lock();
    setTimeout(() => {
      alert("Благодарим за обращение, наши специалисты свяжутся с Вами в ближайшее время");
      this.locker.unlock();
    }, 1500);
  }

}
