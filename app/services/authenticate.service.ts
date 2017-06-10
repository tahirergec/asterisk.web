import {EventEmitter, Injectable} from "@angular/core";
import {AnonymousUser, User} from "../models/user";
import {HttpClient} from "./http.service";

@Injectable()
export class AuthenticateService {

  public static session_id: string = null;
  public static key: string = "4a087b99-1a16-4db6-a318-50dbc134091f";

  public user_emitter: EventEmitter<User> = new EventEmitter<User>();
  private _user: User = null;

  set user(user: User) { }

  get user(): User {
    return this._user;
  }

  private static load_data(): User {
    let user_data, user;

    try {
      user_data = localStorage.getItem("asterisk-web-user-" + AuthenticateService.key);
      user = User.from_json(user_data);
    }
    catch (e) {
      return;
    }

    return user;
  }

  private save_data() {
    const user_data = this._user.to_json();
    localStorage.setItem("asterisk-web-user-" + AuthenticateService.key, user_data);
  }

  public authenticate(username: string, session_id: string, phone: string) {
    AuthenticateService.session_id = session_id;
    this._user = new User(username, session_id, phone);
    this.user_emitter.emit(this._user);

    this.save_data();
  }

  public logout() {
    AuthenticateService.session_id = null;
    this._user = new AnonymousUser();
    this.user_emitter.emit(this._user);
    localStorage.removeItem("asterisk-web-user-" + AuthenticateService.key);
  }

  public static logout() {
    this.session_id = null;
    localStorage.removeItem("asterisk-web-user-" + AuthenticateService.key);
  }

  constructor() {
    this._user = AuthenticateService.load_data() || new AnonymousUser();

    if(this._user) {
      AuthenticateService.session_id = this._user.session_id;
    }

    this.user_emitter.emit(this._user);
  }

}
