import {Component, Input} from "@angular/core";

@Component({
    selector: "[material-table-head]",
    template:`
        <tr>
          <th *ngFor="let column of columns">{{column.caption}}</th>
        </tr>
    `
})
export class MaterialTableHeadComponent {
    @Input() public columns: Array<any> = [];
}
