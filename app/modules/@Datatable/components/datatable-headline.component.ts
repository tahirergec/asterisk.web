import {Component, Input, EventEmitter, Output} from "@angular/core";

@Component({
    selector: "material-table-headline",
    template: `
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8">
            <strong>Найдено результатов: {{showed_lines}}</strong>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <div class="fg-line">
                <div class="select">
                  <select [(ngModel)]="items_per_page" (change)="onPerPageChange()" class="form-control">
                    <option *ngFor="let variant of items_per_page_vars" [ngValue]="variant">
                      Элементов на странице: {{variant}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
})
export class MaterialTableHeadlineComponent {
    @Input() public items_per_page_vars: Array<number>;
    @Input() public items_per_page: number = 10;

    @Output() public items_per_page_change: EventEmitter<number> = new EventEmitter<number>();

    public showed_lines: number = 0;

    onPerPageChange() {
        this.items_per_page_change.emit(this.items_per_page);
    }
}
