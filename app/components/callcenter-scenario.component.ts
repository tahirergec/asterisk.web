import {Component, Renderer} from "@angular/core";
import {CallcentreService} from "../services/callcentre.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

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

  constructor(private callcentre: CallcentreService, private sanitizer: DomSanitizer,
              private renderer: Renderer) {
    this.callcentre.scenario_emitter.subscribe((scenario) => {
      this.window_content = this.sanitizer.bypassSecurityTrustHtml(scenario.text);
      this.opened = true;
    });

    let global = this.renderer.listenGlobal('document', 'click', (evt) => {
      if("a" == evt.srcElement.tagName.toLowerCase() && evt.srcElement.hasAttribute("click-to-call")) {
        this.callcentre.make_call(evt.srcElement.getAttribute("click-to-call"));
      }
    })
  }

}
