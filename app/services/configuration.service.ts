import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class ConfigService {

  public static key: string = "5b5bf7a3-e949-4cee-9b4f-b14b864477b7";

  public settings_emitter: EventEmitter<any> = new EventEmitter<any>();
  public _data: any = null;

  get data(): any {
    if(!this._data) {
      this._data = JSON.parse(localStorage.getItem("asterisk-web-" + ConfigService.key));
    }

    return this._data
  }

  set data(data: any) {
    this._data = data;
    localStorage.setItem("asterisk-web-" + ConfigService.key, JSON.stringify(data));
    this.settings_emitter.emit(this._data);
  }

  public hasCache() {
    return this.data != null;
  }

}
