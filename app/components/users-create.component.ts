import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "../services/http.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: "../../templates/forms/user.html"
})
export class UsersCreateComponent {

  caption: string = "Создание нового пользователя";
  userForm: FormGroup;

  private contexts: Array<any> = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadContextList();
    this.userForm = this.fb.group({
      "stat_fio": [''],
      "defaultuser": ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
      "password": ['', Validators.required],
      "context": [''],
      "account_login": [''],
      "account_password": [''],
    })
  }

  loadContextList() {
    this.http.post('Asterisk.get_allowed_context')
      .subscribe(response => this.contexts = response);
  }

  onSubmit() {
    const post_data = {
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

    this.http.post('Asterisk.user_add', post_data)
      .subscribe(
        (response) => {
          this.router.navigateByUrl("/users");
        },
        (error) => {
          switch(error.error.code) {
            case 40013: {
              alert("Пользователь " + this.userForm.value['defaultuser'] + " уже существует");
              break;
            }
            default: {
              alert("Ошибка при обработке запроса. Код ошибки: " + error.error.code);
            }
          }
        }
      )
  }

}
