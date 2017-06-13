import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {ScenarioService} from "./scenarios.service";
import {ScenarioTreeComponent} from "../scenario-tree.component";

@Component({
  template: `
   <div class="row">
      <div class="col-sm-4 col-md-4 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_content">
            <scenario-tree
              (select_change)="onChange($event)">
            </scenario-tree>
            <div class="ln_solid"></div>
            <a routerLink="/scenarios/create" class="btn btn-sm btn-primary">
              <i class="fa fa-plus"></i> Добавить сценарий
            </a>
          </div>
        </div>
      </div>
      <div class="col-sm-8 col-md-8 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_content">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
   </div>
  `
})
export class ScenarioHomeComponent {

  @ViewChild(ScenarioTreeComponent)
  private tree: ScenarioTreeComponent;

  constructor(private router: Router, private scenario: ScenarioService) {
    this.scenario.need_reload.subscribe(() => this.tree.reload());
  }

  onChange(value: string) {
    this.router.navigate(['scenarios', 'edit', value]);
  }

}
