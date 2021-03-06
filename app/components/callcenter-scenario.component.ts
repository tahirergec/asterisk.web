import {Component, Renderer, ViewChild} from "@angular/core";
import {CallcentreService} from "../services/callcentre.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {WindowModule} from "../modules/@window/window.component";

@Component({
  selector: "app-callcentre-scenario",
  template: `
    <material-window draggable-window [opened]="opened" [cssClass]="'w-500 scenario-window'">
      <div [innerHtml]="window_content"></div>
    </material-window>
  `
})
export class CallcentreScenarioComponent {

  window_content: SafeHtml = "";
  opened: boolean = false;

  @ViewChild(WindowModule)
  private simple_window: WindowModule;

  constructor(private callcentre: CallcentreService, private sanitizer: DomSanitizer,
              private renderer: Renderer) {
    this.callcentre.scenario_emitter.subscribe((scenario) => {
      this.window_content = this.sanitizer.bypassSecurityTrustHtml(scenario.text);
      this.simple_window.opened = true;
    });

    let global = this.renderer.listenGlobal('document', 'click', (evt) => {
      let target = evt.target || evt.srcElement;
      if("a" == target.tagName.toLowerCase() && target.hasAttribute("click-to-call")) {
        this.callcentre.make_call(target.getAttribute("click-to-call"));
      }
    })
  }

}
