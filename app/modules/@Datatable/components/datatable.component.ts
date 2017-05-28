import {Component, Input, ViewChild, Output, EventEmitter} from "@angular/core";
import {MaterialTableHeadlineComponent} from './datatable-headline.component';
import {MaterialTableHeadComponent} from './datatable-head.component';
import {MaterialTableBodyComponent} from './datatable-body.component';
import {MaterialTablePaginationComponent} from './datatable-pagination.component';

import {HttpClient} from "../../../services/http.service";

@Component({
    selector: "material-table",
    template: `
      <div class="material-datatable-wrapper table-responsive">
        <material-table-headline
          [items_per_page_vars]="items_per_page_vars"
          (items_per_page_change)="itemPerPageChange($event)">
        </material-table-headline>
        <table class="table table-responsive table-striped">
          <thead material-table-head
            [columns]="columns"
            (sort_emmit)="onSortChange($event)">
          </thead>
          <tbody material-table-body
            [editable]="editable"
            [removable]="removable"
            (action_element_edit)="fireEdit($event)"
            (action_element_remove)="fireRemove($event)">
          </tbody>
        </table>
        <material-table-pagination
          (change_page)="changePage($event)">
        </material-table-pagination>
      </div>
    `
})
export class MaterialTableComponent {
    public current_page: number = 1;
    public sort: {[key: string]: string} = {};

    @Input() public api_action = "";

    @Input() public items_per_page: number = 10;
    @Input() public items_per_page_vars: Array<number> = [10, 20, 50, 100];

    @Input() public columns: Array<any> = [];

    @ViewChild(MaterialTableHeadlineComponent)
    theadline: MaterialTableHeadlineComponent;

    @ViewChild(MaterialTableHeadComponent)
    thead: MaterialTableHeadComponent;

    @ViewChild(MaterialTableBodyComponent)
    tbody: MaterialTableBodyComponent;

    @ViewChild(MaterialTablePaginationComponent)
    pagination: MaterialTablePaginationComponent;

    constructor(public http: HttpClient){ }

    ngOnInit() {
        for(let i: number = 0; i < this.columns.length; i++) {
            this.tbody.fields.push({
                name: this.columns[i].name,
                template: this.columns[i].template,
            });
        }
        this.loadList();
    }

    itemPerPageChange(count) {
        this.items_per_page = count;
        this.loadList();
    }

    changePage(page: number) {
        this.current_page = page;
        this.loadList();
    }

    getPagination() {
        const offset: number = (this.current_page - 1) * this.items_per_page;
        return {limit: this.items_per_page, offset: offset};
    }

    prepareQuery(): any {
        return this.getPagination();
    }

    loadList() {
        this.http.post(this.api_action, this.prepareQuery())
            .subscribe((response) => {
                this.tbody.rows = response.rows;
                this.theadline.showed_lines = response.count;
                this.pagination.update_pagination.next([response.count, this.items_per_page]);
            })
    }

    append(row: any) {
        this.tbody.rows.unshift(row);
    }

    onSortChange(sort: any) {
      this.sort = sort;
      this.loadList();
    }
}
