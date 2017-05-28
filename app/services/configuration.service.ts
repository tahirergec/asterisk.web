import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class ConfigService {

  public static key: string = "5b5bf7a3-e949-4cee-9b4f-b14b864477b7";

  public settings_emitter: EventEmitter<any> = new EventEmitter<any>();
  public _data: {[key: string]: any} = null;

  private _default: {[key: string]: any} = {
    "modules": {
      "users": false,
      "departments": false,
      "phones": false,
      "helpdesk": false,
    },
    "dashboard_statistic": false,
    "api_url": "http://localhost:8000/api/v1",
    "sounds_url": "http://localhost/monitor/"
  };

  get data(): any {
    if(!this._data) {
      const cache_data = localStorage.getItem("asterisk-web-" + ConfigService.key);
      this._data = cache_data ? JSON.parse(cache_data) : this._default;
    }

    return this._data
  }

  set data(data: any) {
    this._data = data;
    localStorage.setItem("asterisk-web-" + ConfigService.key, JSON.stringify(data));
    this.settings_emitter.emit(this._data);
  }

  public static hasCache():boolean {
    return localStorage.getItem("asterisk-web-" + ConfigService.key) != null;
  }

}
