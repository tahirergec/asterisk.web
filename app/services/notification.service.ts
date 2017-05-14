import {Injectable, EventEmitter} from "@angular/core";
import {NotifyQueue, NotifyInfo, NotifyWarning, ABSNotification} from "../models/notificaction";


@Injectable()
export class NotificationService {

    public _queue: NotifyQueue = new NotifyQueue();
    set queue(queue: NotifyQueue){ }
    get queue(): NotifyQueue{ return this._queue; }

    private audio: any = {info: new Audio(), error: new Audio()};
    public queue_emitter: EventEmitter<NotifyQueue> = new EventEmitter<NotifyQueue>();

    constructor() {
        this.audio.info.src = "/static/sounds/success.mp3";
        this.audio.error.src = "/static/sounds/error.mp3";
    }

    notifyInfo(subject: string, body: string = ""): void {
        const notification = new NotifyInfo(subject, body);
        this.queue.push(notification);

        this.queue_emitter.emit(this.queue);
        this.playBeep();
    }

    notifyError(subject: string, body: string = ""): void {
        const notification = new NotifyWarning(subject, body);
        this.queue.push(notification);

        this.queue_emitter.emit(this.queue);
        this.playError();
    }

    cleanNotify(notification: ABSNotification) {
        this.queue.splice(notification);
        this.queue_emitter.emit(this.queue);
    }

    emptyQueue(): void {
        this._queue = new NotifyQueue();
        this.queue_emitter.emit(this.queue);
    }

    playBeep(): void {
        this.audio.info.play();
    }

    playError(): void {
        this.audio.error.play();
    }

}
