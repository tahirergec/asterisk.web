import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable, Observer} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ConfigService} from "./configuration.service";
import {NotificationService} from "./notification.service";
import {AuthenticateService} from "./authenticate.service";

@Injectable()
export class HttpClient {
    private static api_server: string = '';
    private static api_token: string = 'WWWToken';
    private static jsonrpc: string = '2.0';

    constructor(private http: Http, private config: ConfigService, private notifier: NotificationService) {
      HttpClient.api_server = "http://10.8.0.22:8000/api/v1";
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

    private handleError(handler: Response) {
        this.notifier.notifyError("Ошибка при работе", "Сервер API не отвечает");
        return Observable.throw(handler);
    }
}
