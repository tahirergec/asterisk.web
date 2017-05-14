enum NotificationType {
    info, success, warning, danger
}

export interface INotification {
    subject: string;
    icon: string;

    body?: string;
    type?: NotificationType;
    has_alarm?: boolean;
}

export abstract class ABSNotification implements INotification {
    subject: string;
    icon: string = "/static/img/icons/bullhorn_100x100.png";

    body?: string;
    type?: NotificationType = NotificationType.info;
    has_alarm?: boolean = false;

    constructor(subject: string, body:string = "", type:NotificationType = NotificationType.info, has_alarm: boolean=false) {
        this.subject = subject;
        this.body = body;
        this.type = type;
        this.has_alarm = has_alarm;
    }
}

export class Notification extends ABSNotification { }

export class NotifyInfo extends ABSNotification {
    constructor(subject: string, body:string = "") {
        super(subject, body, NotificationType.info, true);
    }
}

export class NotifySuccess extends ABSNotification {
    constructor(subject: string, body:string = "") {
        super(subject, body, NotificationType.success, true);
    }
}

export class NotifyWarning extends ABSNotification {
    icon: string = "/static/img/icons/warning_100x100.png";

    constructor(subject: string, body:string = "") {
        super(subject, body, NotificationType.warning, true);
    }
}

export class NotifyDanger extends ABSNotification {
    icon: string = "/static/img/icons/warning_100x100.png";

    constructor(subject: string, body:string = "") {
        super(subject, body, NotificationType.danger, true);
    }
}


export class NotifyQueue {
    private _notifications: Array<ABSNotification> = [];
    get notifications(): Array<ABSNotification> { return this._notifications; }
    set notifications(queue: Array<ABSNotification>) { }

    push(notification: ABSNotification): void {
        this.notifications.push(notification);
    }

    splice(notification: ABSNotification): void {
        const index = this.notifications.indexOf(notification);

        if(index !== -1) {
            this.notifications.splice(index, 1);
        }
    }

    get length(): number {
        return this.notifications.length;
    }
}
