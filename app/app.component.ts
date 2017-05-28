import { Component } from "@angular/core";
import {Http} from "@angular/http";
import {User} from "./models/user";
import {AuthenticateService} from "./services/authenticate.service";


@Component({
  selector: "app",
  template: `
    <div class="right_col" [ngClass]="{'m-l-0': user.is_anonymous}" role="main">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {

  private user: User = null;

  constructor(private http: Http, private auth: AuthenticateService) {

    this.user = this.auth.user;
    this.auth.user_emitter.subscribe((user) => this.user = user);
  }

}
