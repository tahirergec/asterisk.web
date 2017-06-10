import {Component} from "@angular/core";
import {LockerService} from "../services/locker.service";
import {HttpClient} from "../services/http.service";
import {NotificationService} from "../services/notification.service";
import {ABSNotification, NotifyQueue} from "../models/notificaction";
import {ConfigService} from "../services/configuration.service";
import {Http} from "@angular/http";
import {AuthenticateService} from "../services/authenticate.service";
import {User} from "../models/user";
import {Router} from "@angular/router";
import {CallcentreService} from "../services/callcentre.service";

@Component({
  selector: "app-navigation",
  template: `
    <div class="top_nav" [ngClass]="{'m-l-0': user.is_anonymous}">
      <div class="nav_menu" *ngIf="!user.is_anonymous">
        <nav>
          <div class="nav toggle">
            <a id="menu_toggle"><i class="fa fa-bars"></i></a>
          </div>

          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
              <a href="javascript:;" class="user-profile" toggle-dropdown>
                <img [src]="'/static/img/avatar.png'" alt=""> {{user.username}}
                <span class=" fa fa-angle-down"></span>
              </a>
              <ul class="dropdown-menu dropdown-usermenu pull-right">
                <li><a href="javascript:void(0)" (click)="logout()">
                  <i class="fa fa-sign-out pull-right"></i> Выйти</a></li>
              </ul>
            </li>
            <li role="presentation" class="dropdown">
              <a href="javascript:;" class="dropdown-toggle info-number" toggle-dropdown>
                <i class="fa fa-gears"></i>
              </a>
              <ul class="dropdown-menu list-unstyled msg_list w-300" role="menu">
                <li>
                  <a (click)="reloadAsterisk()"><i class="fa fa-refresh"></i> Перезагрузить Asterisk </a>
                </li>
                <li style="padding: 5px;">
                  <a (click)="reloadSettings()"><i class="fa fa-cogs"></i> Перезагрузить настройки </a>
                </li>
              </ul>
            </li>
            <li role="presentation" class="dropdown">
              <a href="javascript:;" class="dropdown-toggle info-number" toggle-dropdown>
                <i class="fa fa-bullhorn"></i>
                <span class="badge bg-green" *ngIf="notification_queue.length">
                  {{notification_queue.length}}
                </span>
              </a>
              <ul class="dropdown-menu list-unstyled msg_list w-300" role="menu">
                <li *ngFor="let notification of notification_queue.notifications">
                  <a (click)="emptyQueue()">
                    <span class="image"><img [src]="notification.icon"></span>
                    <span>
                      <span>{{notification.subject}}</span>
                    </span>
                    <span class="message">{{notification.body}}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li *ngIf="user.phone">
              <a>
                <span class="btn btn-sm" [ngClass]="{
                        'btn-success': 1 == phone_state,
                        'btn-danger': 0 == phone_state,
                        'btn-warning': -1 == phone_state
                    }">
                  <i *ngIf="1 == phone_state || 0 == phone_state" class="fa fa-phone-square"></i>
                  <i *ngIf="-1 == phone_state" class="fa fa-spin fa-refresh"></i>
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `
})
export class TopNavigationComponent {

  private notification_queue: NotifyQueue = new NotifyQueue();
  private user: User = null;
  private phone_state: number = 0;

  constructor(private locker: LockerService, private http: HttpClient, private notifier: NotificationService,
              private config: ConfigService, private base_http: Http, private auth: AuthenticateService,
              private router: Router, private callcentre: CallcentreService) {
    this.notifier.queue_emitter.subscribe(queue => this.notification_queue = queue);

    this.user = this.auth.user;
    this.auth.user_emitter.subscribe((user) => this.user = user);

    this.callcentre.state_emitter.subscribe((status) => this.phone_state = status);
  }

  ngOnInit() {
    if(!ConfigService.hasCache()) {
      this.reloadSettings();
    }
  }

  emptyQueue() {
    this.notifier.emptyQueue()
  }

  reloadAsterisk() {
    this.locker.lock();
    setTimeout(() => { this.locker.unlock(); }, 2000);
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }

  reloadSettings() {
    this.base_http.get("/settings.json")
      .subscribe((response) => {
        this.locker.lock();
        setTimeout(() => {
          this.locker.unlock();
          this.notifier.notifyInfo("Обновление", "Настройки приложения обновлены");
        }, 1000);

        this.config.data = response.json()
      });
  }

}
