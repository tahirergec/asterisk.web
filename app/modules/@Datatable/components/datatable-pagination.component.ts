import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Subject} from 'rxjs/Subject';

@Component({
    selector: "material-table-pagination",
    template: `
      <div id="data-table-selection-footer" *ngIf="pages_count>1" class="bootgrid-footer container-fluid">
        <div class="row">
          <div class="col-sm-6">
            <ul class="pagination">
              <li class="first" [ngClass]="{disabled: 1==current_page}">
                <a class="button" (click)="firstPage()">
                  <i class="fa fa-angle-double-left"></i></a>
              </li>
              <li class="prev" [ngClass]="{disabled: 1==current_page}">
                <a data-page="prev" class="button" (click)="previousPage()">
                  <i class="fa fa-angle-left"></i></a>
              </li>
              <li *ngFor="let page of createRange()" [ngClass]="{active: page==current_page}">
                <a class="button" href="javascript:void(0)" (click)="changePage(page)">
                  {{page}}</a>
              </li>
              <li class="next">
                <a data-page="next" class="button"><i class="fa fa-angle-right"></i></a>
              </li>
              <li class="last">
                <a data-page="last" class="button"><i class="fa fa-angle-double-right"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `
})
export class MaterialTablePaginationComponent {
    private pages_count = 1;

    @Input() public items_per_page: number = 10;
    @Input() public items_count: number = 0;
    @Input() public current_page: number = 1;

    @Output() public change_page: EventEmitter<number> = new EventEmitter<number>();

    private _update_pagination: Subject<Array<number>> = new Subject<Array<number>>();
    set update_pagination(value: Subject<Array<number>>) { }
    get update_pagination(): Subject<Array<number>> { return this._update_pagination; }

    constructor() {
        this.update_pagination.subscribe(([items, per_page]:[number, number]) => {
            this.items_count = items;
            this.items_per_page = per_page;
            this.getPagesCount();
        })
    }

    getPagesCount() {
        this.pages_count = Math.ceil(this.items_count / this.items_per_page);
    }

    firstPage() {
        if(this.current_page > 1) {
            this.changePage(1);
        }
    }

    previousPage() {
        if(this.current_page > 1) {
            this.changePage(this.current_page - 1);
        }
    }

    changePage(page: number) {
        this.change_page.emit(page);
        this.current_page = page;
    }

    createRange(){
      let items: number[] = [];
      for(let i = 1; i <= this.pages_count; i++){
         items.push(i);
      }
      return items;
    }
}
