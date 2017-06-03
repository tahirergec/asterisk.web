import {Directive, ElementRef, HostListener, Renderer} from "@angular/core";

@Directive({
    selector: "[draggable-window]"
})
export class WindowDraggableDirective {
    private md:boolean;
    private topStart:number=0;
    private leftStart:number=0;

    constructor(public element: ElementRef, private renderer: Renderer) { }

    @HostListener('click', ['$event'])
    click(event: MouseEvent) {
        const windows = document.getElementsByTagName("material-window");

        for(let i: number = 0; i < windows.length; i++) {
            this.renderer.setElementStyle(windows[i], "z-index", "500");
        }

        this.element.nativeElement.style.zIndex = 550;
    }

    @HostListener('mousedown', ['$event', '$event.target'])
    onMouseDown(event:MouseEvent, target: HTMLElement) {
        if(event.button === 2) {
            return;
        }

        const elementClass = target.className, parentClass = target.parentElement.className;
        if(-1 == elementClass.indexOf("x_title") && -1 == parentClass.indexOf("x_title")) {
            return;
        }

        this.md = true;
        this.topStart = event.clientY - this.element.nativeElement.style.top.replace('px','');
        this.leftStart = event.clientX - this.element.nativeElement.style.left.replace('px','');
    }

    @HostListener('document:mouseup')
    onMouseUp(event:MouseEvent) {
        this.md = false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event:MouseEvent) {
        if(this.md) {
            this.element.nativeElement.style.top = (event.clientY - this.topStart) + 'px';
            this.element.nativeElement.style.left = (event.clientX - this.leftStart) + 'px';
        }
    }
}
