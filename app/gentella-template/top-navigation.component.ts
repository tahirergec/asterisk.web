import {Component} from "@angular/core";
import {LockerService} from "../services/locker.service";
import {HttpClient} from "../services/http.service";
import {NotificationService} from "../services/notification.service";
import {ABSNotification, NotifyQueue} from "../models/notificaction";
import {ConfigService} from "../services/configuration.service";
import {Http} from "@angular/http";

@Component({
  selector: "app-navigation",
  template: `
    <div class="top_nav">
      <div class="nav_menu">
        <nav>
          <div class="nav toggle">
            <a id="menu_toggle"><i class="fa fa-bars"></i></a>
          </div>

          <ul class="nav navbar-nav navbar-right">
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
          </ul>
        </nav>
      </div>
    </div>
  `
})
export class TopNavigationComponent {

  private notification_queue: NotifyQueue = new NotifyQueue();

  constructor(private locker: LockerService, private http: HttpClient, private notifier: NotificationService,
              private config: ConfigService, private base_http: Http) {
    this.notifier.queue_emitter.subscribe(queue => this.notification_queue = queue);
  }

  emptyQueue() {
    this.notifier.emptyQueue()
  }

  reloadAsterisk() {
    this.locker.lock();
    setTimeout(() => { this.locker.unlock(); }, 2000);
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
