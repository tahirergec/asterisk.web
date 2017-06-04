import {Component, Input} from "@angular/core";
import {MaterialTableComponent} from "../@Datatable/components/datatable.component";
import {HttpClient} from "../../services/http.service";

@Component({
  selector: "calllist-material-table",
  template: `
    <div class="material-datatable-wrapper table-responsive">
      <material-table-headline
        [items_per_page_vars]="items_per_page_vars"
        [items_per_page]="items_per_page"
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
export class DatatableCalllistComponent extends MaterialTableComponent{

  @Input() private form;

  constructor(public http: HttpClient){
    super(http);
  }

  prepareQuery() {
    let offset: number = (this.current_page - 1) * this.items_per_page,
      limit = this.items_per_page,
      filter_data = {
        "inoutstatus": this.form.value["inoutstatus"],
        "date_start": this.form.value["date_start"],
        "date_end": this.form.value["date_end"],
        "src": this.form.value["src"],
        "dst": this.form.value["dst"],
      };

    if(!this.form.valid) {
      limit = 0;
    }

    return {
      "limit": limit,
      "offset": offset,
      "sort": this.sort,
      "filter_data": filter_data,
    }
  }

}
