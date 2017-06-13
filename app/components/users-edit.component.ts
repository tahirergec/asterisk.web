import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../services/http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LockerService} from "../services/locker.service";

@Component({
  templateUrl: "../../templates/forms/user.html"
})
export class UsersEditComponent {

  caption: string = "Редактирование пользователя";
  userForm: FormGroup;

  private contexts: Array<any> = [];

  constructor(private activate_router: ActivatedRoute, private http: HttpClient, private fb: FormBuilder,
              private locker: LockerService, private router: Router) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      "stat_fio": [''],
      "defaultuser": ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
      "password": [''],
      "context": [''],
      "account_login": [''],
      "account_password": [''],
    });

    this.locker.lock();

    const user_id = this.activate_router.snapshot.params["name"];

    this.http.post('Asterisk.user_info', {"user_id": user_id})
      .subscribe(
        (response) => {
          setTimeout(() => { this.locker.unlock(); }, 1000);
          this.contexts = response.contexts;

          this.userForm.patchValue({"context": response.context});
          this.userForm.patchValue({"defaultuser": response.name});
          this.userForm.patchValue({"stat_fio": response.stat_fio});
          this.userForm.patchValue({"account_login": response.account_login});
        }
      )

  }

  onSubmit() {
    const post_data = {
      "user_id": parseInt(this.activate_router.snapshot.params["name"]),
      "defaultuser": this.userForm.value['defaultuser'],
      "password": this.userForm.value['password'],
      "codecs": ["ulaw", "alaw"],
      "user_data": {
        "stat_fio": this.userForm.value['stat_fio'],
        "context": this.userForm.value['context'],
        "account_login": this.userForm.value['account_login'],
        "account_password": this.userForm.value['account_password'],
      }
    };

    this.http.post('Asterisk.user_edit', post_data)
      .subscribe(
        (response) => {
          this.router.navigateByUrl("/users");
        },
        (error) => {
          switch(error.error.code) {
            default: {
              alert("Ошибка при обработке запроса. Код ошибки: " + error.error.code);
            }
          }
        }
      )
  }

}
