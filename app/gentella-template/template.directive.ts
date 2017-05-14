import {Directive, ElementRef, HostListener, Renderer} from "@angular/core";

@Directive({
  selector: "[sidebar-link]"
})
export class SidebarDropdownDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  @HostListener('click', ['$event']) private inside(event) {
    event.preventDefault();
    const cond = -1 == this.elementRef.nativeElement.parentNode.className.indexOf("active");
    this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "active", cond);
    this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "toggled", cond);
  }

}


@Directive({
  selector: "[toggle-dropdown]"
})
export class DropdownToggleDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  @HostListener('click', ['$event']) private inside(event) {
      event.preventDefault();
      this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "open", true);
  }

  @HostListener('document:click', ['$event.target']) private outside(targetElement) {
      const clickedInside = this.elementRef.nativeElement.contains(targetElement) ||
          this.elementRef.nativeElement.parentNode.contains(targetElement);

      if(!clickedInside) {
          this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "open", false);
      }
  }

}
