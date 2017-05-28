import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatatableCalllistComponent} from "./datatable-calllist.component";
import {ValidateDate} from "../../validators/date.validator";

@Component({
  selector: "call-list",
  template: `
    <form [formGroup]="form" (submit)="onSubmit()" novalidate>
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <div class="form-group">
              <label for="date_start">Дата начала <sup class="text-danger">*</sup></label>
              <input class="form-control" formControlName="date_start" id="date_start" type="text" 
                     placeholder="XX.XX.XXXX">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="date_end">Дата окончания <sup class="text-danger">*</sup></label>
              <input class="form-control" formControlName="date_end" id="date_end" type="text" 
                     placeholder="XX.XX.XXXX">
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="dial_type">Тип вызова</label>
              <select id="dial_type" class="form-control" formControlName="inoutstatus">
                <option [value]="''">--Любые--</option>
                <option [value]="'incoming'">Входящие</option>
                <option [value]="'outgoing'">Исходящие</option>
                <option [value]="'internal'">Внутренние</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="dial_dest">Назначение вызова</label>
              <input class="form-control" formControlName="dst" id="dial_dst" type="text">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="dial_src">Инициатор вызова</label>
              <input class="form-control" formControlName="src" id="dial_src" type="text">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-2 col-md-offset-4">
            <button type="submit" class="btn btn-primary btn-block" [disabled]="!form.valid">
              <i class="fa fa-filter"></i> Фильтровать
            </button>
          </div>
          <div class="col-md-2">
            <button type="reset" class="btn btn-primary btn-block">
              <i class="fa fa-refresh"></i> Сбросить
            </button>
          </div>
        </div>
        <hr>
        <calllist-material-table
          [api_action]="'Dashboard.call_list'"
          [columns]="columns"
          [form]="form">
        </calllist-material-table>
        <template #inoutstatus let-row="row">
          <span *ngIf="'incoming' == row.status">Входящий</span>
          <span *ngIf="'outgoing' == row.status">Исходящий</span>
          <span *ngIf="'internal' == row.status">Внутренний</span>
        </template>
        <template #dst let-row="row">
          <span *ngIf="'incoming' != row.status">{{row.dst}}</span>
          <span *ngIf="'incoming' == row.status">{{row.dcontext}}</span>
        </template>
        <template #filename let-row="row">
          <audio controls>
            <source [src]="sound_url + row.filename" type="audio/mpeg">
          </audio>
        </template>
      </div>
    </form>
  `
})
export class CallListComponent {

  private columns;
  private form: FormGroup;

  @Input() private sound_url: string = "";

  @ViewChild('inoutstatus')
  private tmpl_inoutstatus: TemplateRef<any>;

  @ViewChild('dst')
  private tmpl_dst: TemplateRef<any>;

  @ViewChild('filename')
  private filename: TemplateRef<any>;

  @ViewChild(DatatableCalllistComponent)
  private calllist: DatatableCalllistComponent;

  constructor(private fb: FormBuilder) { }

  buildForm() {
    this.form = this.fb.group({
      "date_start": ["", [Validators.required, ValidateDate()]],
      "date_end": ["", [Validators.required, ValidateDate()]],
      "inoutstatus": [""],
      "src": [""],
      "dst": [""],
    })
  }

  ngOnInit() {
    this.columns = [
      {"name": "date_start", "caption": "Дата начала", "sortable": true},
      {"name": "date_end", "caption": "Дата окончания", "sortable": true},
      {"name": "inoutstatus", "caption": "Тип вызова", "template": this.tmpl_inoutstatus},
      {"name": "src", "caption": "Источник вызова"},
      {"name": "dst", "caption": "Назначение вызова", "template": this.tmpl_dst},
      {"name": "filename", "caption": "Запись", "template": this.filename},
    ];

    this.buildForm();
  }

  onSubmit() {
    this.calllist.loadList();
  }

}
