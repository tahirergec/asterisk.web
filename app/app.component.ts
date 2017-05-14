import { Component } from "@angular/core";
import {LockerService} from "./services/locker.service";
import {ConfigService} from "./services/configuration.service";
import {Http} from "@angular/http";


@Component({
  selector: "app",
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {

  constructor(private config: ConfigService, private http: Http) {
    if(!this.config.hasCache()) {
      this.http.get("/settings.json")
        .subscribe((response) => this.config.data = response.json());
    }
  }

}
