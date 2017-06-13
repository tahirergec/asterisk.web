import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../services/http.service";
import {LockerService} from "../services/locker.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  templateUrl: "../../templates/forms/queue.html"
})
export class QueuesEditComponent {

  private caption: string = "Редактирование отдела";
  private queueForm: FormGroup;

  private queueMembers = [];
  private queueMembersChecked = [];

  constructor(private activate_route: ActivatedRoute, private router: Router, private http: HttpClient,
              private locker: LockerService, private fb: FormBuilder) {

    this.queueForm = this.fb.group({
      "name": ['', Validators.required],
      "stat_queue_name": ['', Validators.required],
      "strategy": ['ringall', Validators.required]
    })
  }

  onSubmit() {
    if (!this.queueMembersChecked.length) {
      alert("В отделе нет ни одного сотрудника!");
      return;
    }

    const post_data = {
      "name": this.queueForm.value['name'],
      "caption": this.queueForm.value['stat_queue_name'],
      "members": this.queueMembersChecked,
      "queue_data": {
        "strategy": this.queueForm.value['strategy']
      }
    };

    this.http.post('Asterisk.queue_edit', post_data)
      .subscribe(
        (response) => {
          this.router.navigateByUrl("/queues");
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

  ngOnInit() {
    this.locker.lock();

    this.loadMembers();
    const name = this.activate_route.snapshot.params["name"];

    this.http.post('Asterisk.queue_info', {"name": name})
      .subscribe(
        (response) => {
          setTimeout(() => { this.locker.unlock(); }, 1000);
          this.queueForm.patchValue({"name": response.name});
          this.queueForm.patchValue({"stat_queue_name": response.caption});
          this.queueForm.patchValue({"strategy": response.strategy});
          this.queueMembersChecked = response.members;
        }
      );
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
