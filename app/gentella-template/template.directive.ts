import {
  Directive, ElementRef, HostListener, Renderer, AfterViewInit, Component, Input, forwardRef, Output, EventEmitter
}
  from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {HttpClient} from "../services/http.service";

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
  selector: '[click-to-call]'
})
export class ClickToCallDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('click', ['$event']) private click(event) {
    alert('111');
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

  private editor: any = null;
  private initialized: boolean = false;

  @Input() set current_value(value: any) {
    if(this.editor && !this.initialized) {
      try {
        this.editor.tinymce().setContent(value);
        this.initialized = true;
      }
      catch(e) {
        console.log("TinyMCE err detected");
      }
    }
  }
  @Output() change_value: EventEmitter<string> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.editor = jQuery(this.elementRef.nativeElement).tinymce({
      theme: "modern",
      plugins: 'spn_callcentre',
      allow_script_urls: true,
      extended_valid_elements : "div[*],i[*],a[*]",
      setup: (editor) => {
        editor.on("change", (e) => this.change_value
          .next(jQuery(this.elementRef.nativeElement).tinymce().getContent()));
        editor.on("KeyUp", (e) => this.change_value
          .next(jQuery(this.elementRef.nativeElement).tinymce().getContent()));
      }
    })
  }

}


@Component({
  selector: "text-editor",
  template: `
    <textarea wysiwyg (change_value)="onChange($event)" [current_value]="current_value">
      {{current_value}}</textarea>
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

  private _current_value: string = '';

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
  selector: "[tree-view]"
})
export class TreeViewDirective implements AfterViewInit{

  @Input() private api_method: string = "";
  @Output() private select_change: EventEmitter<any> = new EventEmitter();

  private tree: any;

  constructor(private elementRef: ElementRef, private http: HttpClient) { }

  reload() {
    this.http.post(this.api_method)
      .subscribe((response) => {
        jQuery(this.elementRef.nativeElement).jstree(true).settings.core.data = response;
        jQuery(this.elementRef.nativeElement).jstree(true).refresh();
      });
  }

  ngAfterViewInit() {
    if(this.api_method) {
      this.http.post(this.api_method)
        .subscribe((response) => this.tree = jQuery(this.elementRef.nativeElement).jstree({
          core: {
            data: response
          }
        })
        .on("select_node.jstree", (e, data) => this.select_change.next(data.node.id))
      )
    }
  }
}
