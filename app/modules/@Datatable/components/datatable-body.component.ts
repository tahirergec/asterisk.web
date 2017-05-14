import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "[material-table-body]",
    template: `
        <tr *ngFor="let row of rows" [ngClass]="{'info': 'info' == row._rowCls}">
          <td *ngFor="let cell of fields">
            <span *ngIf="!cell.template">{{row[cell.name]}}</span>
            <div
              *ngIf="cell.template"
              [ngTemplateOutlet]="cell.template"
              [ngOutletContext]="{row: row}">
            </div>
          </td>
        </tr>
    `
})
export class MaterialTableBodyComponent {
    public fields: Array<any> = [];

    @Input() rows: Array<any> = [];

    @Input() editable: boolean = true;
    @Input() removable: boolean = true;

    @Output() action_element_edit: EventEmitter<any> = new EventEmitter<any>();
    @Output() action_element_remove: EventEmitter<any> = new EventEmitter<any>();

    fireEdit(row: any) {
        this.action_element_edit.emit(row);
    }

    fireRemove(row: any) {
        this.action_element_remove.emit(row);
    }

    hasActions() {
        return this.editable || this.removable;
    }
}
