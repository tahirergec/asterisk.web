import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {TreeViewDirective} from "../gentella-template/template.directive";

@Component({
  selector: "scenario-tree",
  template: `
    <div tree-view 
      [api_method]="'Scenario.tree'"
      (select_change)="select_change.next($event)"
    >
      <i class="fa fa-spin fa-refresh"></i> Загрузка
    </div>
  `
})
export class ScenarioTreeComponent {

  @Output() private select_change: EventEmitter<any> = new EventEmitter();

  @ViewChild(TreeViewDirective)
  private tree: TreeViewDirective;

  public reload() {
    this.tree.reload();
  }

}
