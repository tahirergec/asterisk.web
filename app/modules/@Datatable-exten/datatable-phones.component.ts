import {Component} from "@angular/core";
import {MaterialTableComponent} from "../@Datatable/components/datatable.component";
import {HttpClient} from "../../services/http.service";

@Component({
    selector: "phones-material-table",
    template: `
      <div class="material-datatable-wrapper table-responsive">
        <material-table-headline
          [items_per_page_vars]="items_per_page_vars"
          (items_per_page_change)="itemPerPageChange($event)">
        </material-table-headline>
        <table class="table table-responsive table-striped">
          <thead material-table-head
            [columns]="columns">
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
export class PhonesMaterialTableComponent extends MaterialTableComponent{

  constructor(public http: HttpClient){
    super(http);
  }

  prepareQuery(): any{
    const offset: number = (this.current_page - 1) * this.items_per_page;

    return {
      "limit": this.items_per_page,
      "offset": offset,
      "usr_filter": {
        "stat_object_type": "phone"
      }
    }
  }

}
