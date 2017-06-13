import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../services/http.service";
import {LockerService} from "../services/locker.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  templateUrl: "../../templates/forms/phone.html"
})
export class PhonesEditComponent {

  private phoneForm: FormGroup;

  private queues: Array<any> = [];
  private peers: Array<any> = [];


  private phone_id: string = this.activate_route.snapshot.params["name"];

  constructor(private activate_route: ActivatedRoute, private router: Router, private http: HttpClient,
              private locker: LockerService, private fb: FormBuilder) {
    this.phoneForm = this.fb.group({
      "stat_fio": ['', Validators.required],
      "host": ['', Validators.required],
      "port": ['5060', Validators.required],
      "defaultuser": ['', Validators.required],
      "password": [''],
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
    this.loadData();
  }

  loadData() {
    this.http.post('Asterisk.phone_get', {"user_id": parseInt(this.phone_id)})
      .subscribe((response) => {
        this.phoneForm.patchValue({"stat_fio": response.stat_fio});
        this.phoneForm.patchValue({"host": response.host});
        this.phoneForm.patchValue({"defaultuser": response.defaultuser});
        this.phoneForm.patchValue({"transfer_type": response.transfer_type});

        if(response.department_name) {
          this.phoneForm.patchValue({"department_name": response.department_name});
        }

        if(response.peer_name) {
          this.phoneForm.patchValue({"peer_name": response.peer_name});
        }

        this.phoneForm.patchValue({"use_for_outgng": response.use_for_outgng || false});
        this.phoneForm.patchValue({"use_for_redir": response.use_for_redir || false});
      });
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
      "phone_id": parseInt(this.phone_id),
      "defaultuser": this.phoneForm.value["defaultuser"],
      "password": this.phoneForm.value["password"],
      "peer_id": parseInt(this.phoneForm.value["peer_name"]),
      "department_name": this.phoneForm.value["department_name"],
      "transfer_type": this.phoneForm.value["transfer_type"],
      "phone_data": {
        "stat_fio": this.phoneForm.value["stat_fio"],
        "stat_use_for_outgng": this.phoneForm.value["use_for_outgng"],
        "stat_use_for_redir": this.phoneForm.value["use_for_redir"],
        "host": this.phoneForm.value["host"],
        "port": parseInt(this.phoneForm.value["port"]),
        "insecure": "invite",
      }
    };

    this.http.post("Asterisk.phone_edit", post_data)
      .subscribe(
        (response) => {
          this.router.navigateByUrl("/phones");
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
