import {Component} from "@angular/core";
import {HttpClient} from "../services/http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  templateUrl: "../../templates/forms/queue.html"
})
export class QueueCreateComponent {

  private caption: string = "Создание нового отдела";
  private queueForm: FormGroup;

  private queueMembers = [];
  private queueMembersChecked = [];

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.queueForm = this.fb.group({
      "name": [''],
      "stat_queue_name": ['', Validators.required],
      "strategy": ['ringall', Validators.required]
    })
  }

  ngOnInit() {
    this.loadMembers();
  }

  onSubmit() {
    if(!this.queueMembersChecked.length) {
      alert("В отделе нет ни одного сотрудника!");
      return;
    }

    const post_data = {
      "caption": this.queueForm.value['stat_queue_name'],
      "members": this.queueMembersChecked,
      "queue_data": {
        "strategy": this.queueForm.value['strategy']
      }
    };

    this.http.post('Asterisk.queue_add', post_data)
      .subscribe(
        (response) => {
          this.router.navigateByUrl("/queues");
        },
        (error) => {
          switch(error.error.code) {
            case 40013: {
              alert("Отдел " + this.queueForm.value['defaultuser'] + " уже существует");
              break;
            }
            default: {
              alert("Ошибка при обработке запроса. Код ошибки: " + error.error.code);
            }
          }
        }
      )
  }

  toggleMember(row) {
    if(this.isChecked(row)){
      this.queueMembersChecked.splice(this.queueMembersChecked.indexOf(row.id), 1);
    }
    else {
      this.queueMembersChecked.push(row.id);
    }
  }

  isChecked(row) {
    return this.queueMembersChecked.indexOf(row.id) !== -1;
  }

  loadMembers() {
    const params = {
      "limit": 9999,
      "offset": 0,
      "usr_filter": {
        "stat_object_type": "internal"
      }
    };

    this.http.post('Asterisk.user_list', params)
      .subscribe((response) => this.queueMembers = response.rows);
  }

}
