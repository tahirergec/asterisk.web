import {NgModule } from "@angular/core";
import {BrowserModule } from "@angular/platform-browser";
import {FormsModule }   from '@angular/forms';
import {ReactiveFormsModule } from "@angular/forms";
import {Routes, RouterModule } from '@angular/router';
import {HttpModule, JsonpModule } from '@angular/http';
import {AppComponent } from "./app.component";

import {SidebarTemplateComponent} from "./gentella-template/sidebar.component";
import {SidebarDropdownDirective, DropdownToggleDirective} from "./gentella-template/template.directive";
import {LockerComponent} from "./gentella-template/locker.component";
import {TopNavigationComponent} from "./gentella-template/top-navigation.component";

import {LockerService} from "./services/locker.service";
import {HttpClient} from "./services/http.service";

import {DashboardComponent} from "./components/dashboard.component";
import {PageNotFoundComponent} from "./components/page-not-found.component";
import {BugReportComponent} from "./components/bugreport.component";

import {UsersListComponent} from "./components/users-list.component";
import {UsersEditComponent} from "./components/users-edit.component";
import {UsersCreateComponent} from "./components/users-create.component";

import {QueuesListComponent} from "./components/queues-list.component";
import {QueueCreateComponent} from "./components/queues-create.component";
import {QueuesEditComponent} from "./components/queues-edit.component";

import {PhonesListComponent} from "./components/phones-list.component";
import {PhonesCreateComponent} from "./components/phones-create.component";
import {PhonesEditComponent} from "./components/phones-edit.component";

import {MaterialTablesModule} from "./modules/@Datatable/datatables.module";
import {WidgetComponent} from "./modules/@widgets/widgets.component";

import {ConfigService} from "./services/configuration.service";
import {NotificationService} from "./services/notification.service";

const appRoutes: Routes =[
  { path: '', component: DashboardComponent },
  { path: 'bugreport', component: BugReportComponent, pathMatch: 'full' },
  { path: 'phones', component: PhonesListComponent, pathMatch: 'full' },
  { path: 'phones/create', component: PhonesCreateComponent, pathMatch: 'full' },
  { path: 'phones/:name', component: PhonesEditComponent, pathMatch: 'full' },
  { path: 'queues', component: QueuesListComponent, pathMatch: 'full' },
  { path: 'queues/create', component: QueueCreateComponent, pathMatch: 'full' },
  { path: 'queues/:name', component: QueuesEditComponent, pathMatch: 'full' },
  { path: 'users', component: UsersListComponent, pathMatch: 'full' },
  { path: 'users/create', component: UsersCreateComponent, pathMatch: 'full' },
  { path: 'users/:name', component: UsersEditComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    MaterialTablesModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    LockerService,
    HttpClient,
    ConfigService,
    NotificationService,
  ],
  declarations: [
    AppComponent,
    LockerComponent,
    SidebarTemplateComponent,
    TopNavigationComponent,
    SidebarDropdownDirective,
    DropdownToggleDirective,
    DashboardComponent,
    PageNotFoundComponent,
    UsersListComponent,
    UsersEditComponent,
    UsersCreateComponent,
    QueuesListComponent,
    QueueCreateComponent,
    QueuesEditComponent,
    PhonesListComponent,
    PhonesCreateComponent,
    PhonesEditComponent,
    BugReportComponent,
    WidgetComponent,
  ],
  bootstrap: [
    AppComponent,
    LockerComponent,
    SidebarTemplateComponent,
    TopNavigationComponent
  ]
})
export class AppModule { }
