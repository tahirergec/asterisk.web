import {Component, Renderer} from "@angular/core";
import {LockerService} from "../services/locker.service";

@Component({
  selector: "app-locker",
  template: `
    <div *ngIf="is_locked" id="locker-wrapper">
      <div class="loader-wrapper">
        <i class="fa fa-spin fa-refresh"></i>
      </div>  
    </div>
  `
})
export class LockerComponent {

  is_locked: boolean = false;

  constructor(private locker: LockerService, private renderer: Renderer) { }

  ngOnInit() {
    this.locker.change_state.subscribe((locked) => {
      this.renderer.setElementClass(document.getElementById("body-main"), "has-blur", locked);
      this.is_locked = locked;
    });
  }

}
