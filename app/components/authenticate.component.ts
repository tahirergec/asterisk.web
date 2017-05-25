import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticateService} from "../services/authenticate.service";
import {Router} from "@angular/router";

@Component({
  template: `
    <div class="login_wrapper">
      <div class="animate form login_form">
        <section class="login_content">
          <form [formGroup]="form" (submit)="onSubmit()" novalidate>
            <h1>Авторизация</h1>
            <div>
              <input type="text" formControlName="username" class="form-control" placeholder="Имя пользователя">
            </div>
            <div>
              <input type="password" formControlName="password" class="form-control" placeholder="Пароль">
            </div>
            <div>
              <button [disabled]="!form.valid" type="submit" class="btn btn-default">
                <i class="fa fa-sign-in"></i> Войти в программу</button>
            </div>
            <div class="clearfix"></div>
          </form>
        </section>
      </div>
    </div>
  `
})
export class AuthenticateComponent {

  private form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthenticateService, private router: Router) {
    this.form = this.fb.group({
      "username": ['', Validators.required],
      "password": ['', Validators.required]
    })
  }

  onSubmit() {
    const form_data = {
      "username": this.form.value['username'],
      "password": this.form.value['password']
    };

    this.auth.authenticate(form_data['username']);
    this.router.navigateByUrl("");
  }

}
