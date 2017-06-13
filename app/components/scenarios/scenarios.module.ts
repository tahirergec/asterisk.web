import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../../guards/auth.guard";
import {ScenarioHomeComponent} from "./scenarios.component";
import {ScenarioListComponent} from "./scenarios-list.component";
import {ScenarioTreeComponent} from "../scenario-tree.component";
import {EditorComponent, TinyMceDirective, TreeViewDirective} from "../../gentella-template/template.directive";
import {ScenarioCreateComponent} from "./scenarios-create.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ScenarioEditComponent} from "./scenarios-edit.component";
import {ScenarioService} from "./scenarios.service";

const ScenarioRouter: Routes = [
  {
    path: '',
    component: ScenarioHomeComponent,
    canActivate:[AuthGuard],
    children: [
      { path: 'list', component: ScenarioListComponent, canActivate:[AuthGuard] },
      { path: 'create', component: ScenarioCreateComponent, canActivate:[AuthGuard] },
      { path: 'edit/:id', component: ScenarioEditComponent, canActivate:[AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(ScenarioRouter)
  ],
  declarations: [
    ScenarioHomeComponent,
    ScenarioListComponent,
    ScenarioTreeComponent,
    ScenarioCreateComponent,
    ScenarioEditComponent,
    EditorComponent,
    TinyMceDirective,
    TreeViewDirective,
  ],
  providers: [
    ScenarioService,
  ],
  exports: [
    ScenarioHomeComponent,
  ]
})
export class ScenariosModule {

}
