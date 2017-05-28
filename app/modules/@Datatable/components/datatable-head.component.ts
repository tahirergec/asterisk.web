import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: "[material-table-head]",
    template:`
        <tr>
          <th *ngFor="let column of columns">
            <span *ngIf="!column.sortable">{{column.caption}}</span>
            <a href="javascript:void(0)" *ngIf="column.sortable" (click)="sortChange(column.name)">
              {{column.caption}}
              <i class="fa" [ngClass]="{'fa-sort': !sort[column.name], 
                                        'fa-sort-asc': 'asc' == sort[column.name],
                                        'fa-sort-desc': 'desc' == sort[column.name]}"></i>
            </a>
          </th>
        </tr>
    `
})
export class MaterialTableHeadComponent {

    public sort: {[key: string]: string} = {};

    @Output() public sort_emmit: EventEmitter<{[key: string]: string}> = new EventEmitter();

    @Input() public multisort: boolean = false;
    @Input() public columns: Array<any> = [];

    prepareSort(column_name: string) {
      if(!this.multisort) {
        for(let key in this.sort) {
          if(column_name != key) {
            delete this.sort[key];
          }
        }
      }
    }

    sortChange(column_name: string) {
      this.prepareSort(column_name);

      this.sort[column_name] = !this.sort[column_name] || ("desc" == this.sort[column_name]) ? "asc" : "desc";
      this.sort_emmit.emit(this.sort);
    }
}
