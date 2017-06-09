import {NgModule } from "@angular/core";
import {BrowserModule } from "@angular/platform-browser";
import {FormsModule }   from '@angular/forms';
import {ReactiveFormsModule } from "@angular/forms";
import {Routes, RouterModule } from '@angular/router';
import {HttpModule, JsonpModule } from '@angular/http';
import {AppComponent } from "./app.component";

import {SidebarTemplateComponent} from "./gentella-template/sidebar.component";
import {
  SidebarDropdownDirective, DropdownToggleDirective,
  DatepickerComponent, DatepickerDirective, EditorComponent, TinyMceDirective, TreeViewDirective
} from "./gentella-template/template.directive";
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
import {AuthenticateService} from "./services/authenticate.service";
import {AuthGuard} from "./guards/auth.guard";
import {AuthenticateComponent} from "./components/authenticate.component";
import {CallListComponent} from "./modules/@Calllist/calllist.component";
import {DatatableCalllistComponent} from "./modules/@Calllist/datatable-calllist.component";
import {CallcentreComponent} from "./components/callcentre.component";
import {CallcentreService} from "./services/callcentre.service";
import {WindowModule} from "./modules/@window/window.component";
import {WindowDraggableDirective} from "./modules/@window/window.directives";
import {DialComponent} from "./modules/@call/call.component";
import {CallsPipe} from "./pipes/calls.pipe";
import {ScenarioComponent} from "./components/scenario.component";
import {ScenarioTreeComponent} from "./components/scenario-tree.component";

const appRoutes: Routes =[
  { path: '', component: DashboardComponent, canActivate:[AuthGuard] },
  { path: 'scenarios', component: ScenarioComponent, canActivate:[AuthGuard] },
  { path: 'bugreport', component: BugReportComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'phones', component: PhonesListComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'phones/create', component: PhonesCreateComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'phones/:name', component: PhonesEditComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'queues', component: QueuesListComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'queues/create', component: QueueCreateComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'queues/:name', component: QueuesEditComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'users', component: UsersListComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'users/create', component: UsersCreateComponent, pathMatch: 'full', canActivate:[AuthGuard] },
  { path: 'users/:name', component: UsersEditComponent, canActivate:[AuthGuard] },
  { path: 'login', component: AuthenticateComponent },
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
    AuthenticateService,
    CallcentreService,
    AuthGuard,
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
    AuthenticateComponent,
    CallListComponent,
    DatatableCalllistComponent,
    CallcentreComponent,
    WindowModule,
    WindowDraggableDirective,
    DialComponent,
    CallsPipe,
    DatepickerComponent,
    DatepickerDirective,
    ScenarioComponent,
    EditorComponent,
    TinyMceDirective,
    ScenarioTreeComponent,
    TreeViewDirective,
  ],
  bootstrap: [
    AppComponent,
    LockerComponent,
    SidebarTemplateComponent,
    TopNavigationComponent,
    CallcentreComponent
  ]
})
export class AppModule { }
