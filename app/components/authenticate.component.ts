import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticateService} from "../services/authenticate.service";
import {Router} from "@angular/router";
import {HttpClient} from "../services/http.service";

@Component({
  template: `
    <div class="login_wrapper">
      <div class="animate form login_form">
        <section class="login_content">
          <div class="alert alert-danger alert-dismissible text-center" role="alert" *ngIf="has_err">
            Неправильный логин или пароль
          </div>
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
  private has_err: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthenticateService, private router: Router,
              private http: HttpClient) {
    this.form = this.fb.group({
      "username": ['', Validators.required],
      "password": ['', Validators.required]
    })
  }

  onAuthenticate(username: string, session_id: string, phone: string) {
    this.has_err = false;
    this.auth.authenticate(username, session_id, phone);
    this.router.navigateByUrl("");
  }

  onAuthenticateErr() {
    this.has_err = true;
  }

  onSubmit() {
    const form_data = {
      "username": this.form.value['username'],
      "password": this.form.value['password']
    };

    this.http.post("Session.signin", {"username": form_data.username, "password": form_data.password})
      .subscribe(
        (response) => this.onAuthenticate(form_data.username, response.session_id, response.phone),
        (error_handler) => this.onAuthenticateErr(),
      );
  }

}
