import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';

import {MaterialTableComponent} from './components/datatable.component';
import {MaterialTableHeadlineComponent} from './components/datatable-headline.component';
import {MaterialTableHeadComponent} from './components/datatable-head.component';
import {MaterialTableBodyComponent} from './components/datatable-body.component';
import {MaterialTablePaginationComponent} from './components/datatable-pagination.component';

import {UsersMaterialTableComponent} from '../@Datatable-exten/datatable-users.component';
import {PhonesMaterialTableComponent} from '../@Datatable-exten/datatable-phones.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule
    ],
    declarations: [
      MaterialTableComponent,
      MaterialTableHeadlineComponent,
      MaterialTableHeadComponent,
      MaterialTableBodyComponent,
      MaterialTablePaginationComponent,

      UsersMaterialTableComponent,
      PhonesMaterialTableComponent,
    ],
    exports: [
      MaterialTableComponent,
      MaterialTableHeadlineComponent,
      MaterialTableHeadComponent,
      MaterialTableBodyComponent,
      MaterialTablePaginationComponent,

      UsersMaterialTableComponent,
      PhonesMaterialTableComponent,
    ]
})
export class MaterialTablesModule { }
