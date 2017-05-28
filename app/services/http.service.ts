import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable, Observer} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ConfigService} from "./configuration.service";
import {NotificationService} from "./notification.service";
import {AuthenticateService} from "./authenticate.service";
import {Router} from "@angular/router";

@Injectable()
export class HttpClient {
  private static api_server: string = '';
  private static api_token: string = 'WWWToken';
  private static jsonrpc: string = '2.0';

  constructor(private http: Http, private config: ConfigService, private notifier: NotificationService,
              private router: Router, private auth: AuthenticateService) {
    HttpClient.api_server = this.config.data.api_url;
    this.config.settings_emitter.subscribe((data) => HttpClient.api_server = data.api_url);
  }

  private static createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json');

    if(AuthenticateService.session_id) {
      headers.append('Authorization', HttpClient.api_token + ' ' + AuthenticateService.session_id);
    }
  }

  private static createRPCRequest(method: string, params: any) {
    return {
      'id': Math.floor(Math.random() * 99) + 1,
      'jsonrpc': HttpClient.jsonrpc,
      'method': method,
      'params': params
    }
  }

  post(action: string, params: any = {}) {
    let headers = new Headers();
    HttpClient.createAuthorizationHeader(headers);
    let data: string = JSON.stringify(HttpClient.createRPCRequest(action, params));

    return this.http.post(HttpClient.api_server, data, {headers: headers})
      .map((response: Response) => {
        if(response.json().error){ throw Observable.throw(response.json().error); }
        return response.json().result
      })
      .catch((handler) => this.handleError(handler));
  }

  private handleError(handler: any) {
    if(handler.status == 401 || (handler.error && handler.error.code == 40010)) {
      if(AuthenticateService.session_id) {
        this.auth.logout();
        this.router.navigateByUrl("/login");
      }

      return Observable.throw(handler);
    }

    this.notifier.notifyError("Ошибка при работе", "Сервер API не отвечает");
    return Observable.throw(handler);
  }
}
