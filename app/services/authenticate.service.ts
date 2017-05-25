import {EventEmitter, Injectable} from "@angular/core";
import {AnonymousUser, User} from "../models/user";
import {HttpClient} from "./http.service";

@Injectable()
export class AuthenticateService {

  public static session_id: string = null;

  public user_emitter: EventEmitter<User> = new EventEmitter<User>();
  private _user: User = null;

  set user(user: User) { }

  get user(): User {
    return this._user;
  }

  private load_data(): boolean {
    return false;
  }

  public authenticate(username: string) {
    this._user = new User(username);
    this.user_emitter.emit(this._user);
  }

  public logout() {
    this._user = new AnonymousUser();
    this.user_emitter.emit(this._user);
  }

  constructor(private http: HttpClient) {
    this._user = new AnonymousUser();
    this.user_emitter.emit(this._user);
  }

}
