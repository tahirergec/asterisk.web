import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "../services/http.service";
import {LockerService} from "../services/locker.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: "../../templates/forms/phone.html"
})
export class PhonesCreateComponent {

  private caption: string = "Добавление телефона";
  private phoneForm: FormGroup;

  private queues: Array<any> = [];
  private peers: Array<any> = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private locker: LockerService,
              private router: Router) {
    this.phoneForm = this.fb.group({
      "stat_fio": ['', Validators.required],
      "host": ['', Validators.required],
      "port": ['5060', Validators.required],
      "defaultuser": ['', Validators.required],
      "password": ['', Validators.required],
      "transfer_type": [''],
      "department_name": [''],
      "peer_name": [''],
      "use_for_outgng": [false],
      "use_for_redir": [false],
    });
  }

  ngOnInit() {
    this.locker.lock();
    setTimeout(() => { this.locker.unlock(); }, 1000);
    this.loadPeers();
    this.loadQueues();
  }

  loadQueues() {
    this.http.post('Asterisk.queue_list', {"offset": 0, "limit": 9999})
      .subscribe((response) => {
        this.queues = response.rows;

        if(this.queues.length) {
          this.phoneForm.patchValue({"department_name": this.queues[0].name});
        }
      });
  }

  loadPeers() {
    this.http.post('Asterisk.user_list', {"offset": 0, "limit": 9999, "usr_filter": { "stat_object_type": "internal"}})
      .subscribe((response) => {
        this.peers = response.rows;

        if(this.peers.length) {
          this.phoneForm.patchValue({"peer_name": this.peers[0].name});
        }
      })
  }

  onSubmit() {
    const post_data = {
      "stat_fio": this.phoneForm.value["stat_fio"],
      "defaultuser": this.phoneForm.value["defaultuser"],
      "password": this.phoneForm.value["password"],
      "peer_id": parseInt(this.phoneForm.value["peer_name"]),
      "department_name": this.phoneForm.value["department_name"],
      "transfer_type": this.phoneForm.value["transfer_type"],
      "phone_data": {
        "stat_use_for_outgng": this.phoneForm.value["use_for_outgng"],
        "stat_use_for_redir": this.phoneForm.value["use_for_redir"],
        "host": this.phoneForm.value["host"],
        "port": parseInt(this.phoneForm.value["port"]),
      }
    };

    this.http.post("Asterisk.phone_add", post_data)
      .subscribe(
        (response) => {
          this.router.navigateByUrl("/phones");
        },
        (error) => {
          switch(error.error.code) {
            case 40013: {
              alert("Номер " + this.phoneForm.value['defaultuser'] + " уже существует");
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
