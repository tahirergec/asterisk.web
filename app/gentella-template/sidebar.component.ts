import {Component} from "@angular/core";
import {ConfigService} from "../services/configuration.service";
import {LockerService} from "../services/locker.service";
import {AuthenticateService} from "../services/authenticate.service";
import {User} from "../models/user";

@Component({
  selector: "app-sidebar",
  template: `
    <div class="col-md-3 left_col" *ngIf="modules && !user.is_anonymous">
      <div class="left_col scroll-view">
        <div class="navbar nav_title" style="border: 0;">
          <a href="javascript:void(0)" class="site_title">
            <i class="fa fa-asterisk"></i> <span>Asterisk.Web</span>
          </a>
        </div>
        <div class="clearfix"></div>
  
        <br />
        <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
          <div class="menu_section">
            <h3>Основное</h3>
            <ul class="nav side-menu">
              <li routerLinkActive="active">
                <a routerLink=""><i class="fa fa-home"></i> Главная </a>
              </li>
              <li routerLinkActive="active" *ngIf="modules && modules.users">
                <a routerLink="/users"><i class="fa fa-user"></i> Сотрудники </a>
              </li>
              <li routerLinkActive="active" *ngIf="modules && modules.departments">
                <a routerLink="/queues"><i class="fa fa-users"></i> Отделы </a>
              </li>
              <li routerLinkActive="active" *ngIf="modules && modules.phones">
                <a routerLink="/phones"><i class="fa fa-phone-square"></i> Номера </a>
              </li>
              <li routerLinkActive="active" *ngIf="modules && modules.phones">
                <a routerLink="/scenarios"><i class="fa fa-pencil-square"></i> Сценарии </a>
              </li>
              <li routerLinkActive="active" *ngIf="modules && modules.helpdesk">
                <a routerLink="/bugreport"><i class="fa fa-bug"></i> Сообщить о сбое </a>
              </li>
            </ul>
          </div>
    
        </div>
        
      </div>
    </div>
  `
})
export class SidebarTemplateComponent {

  private modules: Object = null;
  private user: User = null;

  constructor(private config: ConfigService, private locker: LockerService, private auth: AuthenticateService) {
    this.modules = this.config.data.modules;
    this.config.settings_emitter.subscribe((data) => this.modules = data.modules);

    this.user = this.auth.user;
    this.auth.user_emitter.subscribe((user) => this.user = user);
  }

}
