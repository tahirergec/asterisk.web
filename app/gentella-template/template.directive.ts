import {
  Directive, ElementRef, HostListener, Renderer, AfterViewInit, Component, Input, forwardRef, Output, EventEmitter
}
  from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var jQuery:any;

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


@Directive({
  selector: "[initialize-datepicker]"
})
export class DatepickerDirective implements AfterViewInit {

  @Output() value_emitter: EventEmitter<string> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    jQuery(this.elementRef.nativeElement).datepicker({
      onSelect: (dateText) => {
        this.value_emitter.next(dateText);
      }
    });
  }

}


@Component({
  selector: "datepicker",
  template: `
    <input class="form-control" type="text" placeholder="XX.XX.XXXX" 
           initialize-datepicker (value_emitter)="onChange($event)">
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements ControlValueAccessor{

  @Input() private id: string = "";

  private _current_value: string;

  private get current_value(): string {
    return this._current_value;
  }

  private set current_value(value: string) {
    this._current_value = value;
    this.propagateChange(this._current_value);
  }

  propagateChange = (_: any) => {};

  onChange(value: string) {
    this.current_value = value;
  }

  writeValue(value: any) {
    this.current_value = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

}

@Directive({
  selector: "[wysiwyg]"
})
export class TinyMceDirective implements AfterViewInit{

  @Output() change_value: EventEmitter<string> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    jQuery(this.elementRef.nativeElement).wysihtml5({
      locale: "ru-RU",
      toolbar: {
        blockquote: false
      },
      events: {
        blur: ($target) => this.change_value.next(jQuery(this.elementRef.nativeElement).val())
      }
    });
  }

}


@Component({
  selector: "text-editor",
  template: `
    <textarea wysiwyg (change_value)="onChange($event)"></textarea>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true
    }
  ]
})
export class EditorComponent {

  private _current_value: string;

  private get current_value(): string {
    return this._current_value;
  }

  private set current_value(value: string) {
    this._current_value = value;
    this.propagateChange(this._current_value);
  }

  propagateChange = (_: any) => {};

  onChange(value: string) {
    this.current_value = value;
  }

  writeValue(value: any) {
    this.current_value = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

}
